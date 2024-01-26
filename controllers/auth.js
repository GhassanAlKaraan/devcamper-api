const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

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