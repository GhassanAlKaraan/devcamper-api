const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const geocoder = require('../utils/geocoder');
const path = require('path');

// @desc    Get All Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query with spread operator
  const reqQuery = { ...req.query };

  // Fields to exclude for filtering
  const removeFields = ['select', 'sort', 'page', 'limit', 'includeCourses'];

  // Remove the fields from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resources with the query
  // query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
  query = Bootcamp.find(JSON.parse(queryStr));
  if (req.query.includeCourses === 'true') {
    query = query.populate('courses');
  }


  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments(JSON.parse(queryStr));


  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if(startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  // Success response
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
});

// @desc    Get Single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create Single Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Update Single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
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
});

// @desc    Delete Single Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }
  const deletedBootcamp = await bootcamp.deleteOne();
  await Course.deleteMany({ bootcamp: deletedBootcamp.id});

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance   /:unit
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/long from geocoder: can be done on frontend or backend
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Get radius using radians
  // Divide dist by radius of Earth
  // Earth radius = 3,963 mi / 6,378 km
  const radius = distance / 3963; // in miles

  const bootcamps = await Bootcamp.find({
    // Advanced querying
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Upload photo for bootcamp
// @route   DELETE /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  
  const bootcamp = await Bootcamp.findById(req.params.id);
  const file = req.files.file;
  const MAXSIZE= process.env.MAX_FILE_UPLOAD;
  const UPLOADPATH = process.env.FILE_UPLOAD_PATH;
  
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));
  }
  if(!req.files){
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  if(file.size> MAXSIZE){
    const sizeInMb = MAXSIZE/1000000;
    return next(new ErrorResponse(`Please upload an image less than ${sizeInMb}MB`, 400));
  }

  // You can use timestamp or any other format for naming
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  // Move file
  file.mv(`${UPLOADPATH}/${file.name}`, async err =>{
    if(err){
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

    res.status(200).json({ success: true, data: file.name});
  });

  
});