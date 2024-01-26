const express = require('express');

// Destructure controller
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');
const {protect} = require('../middleware/auth');


// Create express router instance
const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// Upload photo
router.route('/:id/photo').put(protect, bootcampPhotoUpload);

// Specify routes for methods
router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp);
router.route('/:id').get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);


// Export routes
module.exports = router;
