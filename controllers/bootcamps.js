const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
// @desc    Get All Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

// @desc    Get Single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      // Well structured id but doesn't exist
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
      ); // Let the middleware handle the error
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    // Bad id
    // res.status(400).json({ success: false });
    // next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)); // Let the middleware handle the error
    next(err);
  }
};

// @desc    Create Single Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

// @desc    Update Single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    // return res.status(400).json({ success: false });
    next(err);
  }
};

// @desc    Delete Single Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      // console.log('bootcamp doesnt exist');
      // return res.status(400).json({ success: false });
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    // console.log('Operation error');
    // return res.status(400).json({ success: false });
    next(err);
  }
};
