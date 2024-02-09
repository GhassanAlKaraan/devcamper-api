const sendEmail = require('../utils/sendEmail');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // No need to validate because we are using the model, it's already validating

  // Create User
  const user = await User.create({
    name,
    email,
    password, // model middleware will hash this when the password is saved
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide an email and a password', 400)
    );
  }
  // Check for user
  const user = await User.findOne({ email: email }).select('+password'); // because in schema we removed the password from select
  if (!user) {
    return next(
      new ErrorResponse('Invalid credentials', 401) //*1 same here
    );
  }

  // Check if passwords match
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(
      new ErrorResponse('Invalid credentials', 401) //*2 same here
    );
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});


// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if(!user){
    return next(new ErrorResponse(
      'There is no user with that email address',
      404
    ))
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false }); // don't validate

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`;

  const message = `
  You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n
  ${resetUrl}
  `;

  try{
    await sendEmail({
      email:user.email,
      subject: 'Password reset token',
      message
    });


    res.status(200).json({
      success: true,
      data: 'Email sent'
    });

  }catch(err){

    console.log(err);
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
  
    await user.save({validateBeforeSave: false});

    return next(new ErrorResponse(
      'Email could not be send',
      500
    ));

  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetpassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get Hashed token
  const hashedToken = crypto
  .createHash('sha256')
  .update(req.params.resettoken)
  .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}
  });

  if(!user){
    return next(new ErrorResponse(
      'Invalid token',
      400
    ));
  }
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });

  sendTokenResponse(user, 200, res);

});


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Create cookie
  const options = {
    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE  * 24*60*60*1000),
    httpOnly: true
  };

  if(process.env.NODE_ENV === 'production'){
    options.secure = true;
  }

  res
  .status(statusCode)
  .cookie('token', token, options)
  .json({
    success: true,
    token: token
  })
}

