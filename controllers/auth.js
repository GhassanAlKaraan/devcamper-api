const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register user
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next)=>{

    const {name, email, password, role} = req.body;

    // Create User
    const user = await User.create({
        name,
        email,
        password, // model middleware will hash this when the password is saved
        role
    });

    

    res.status(200).json({success: true});
})