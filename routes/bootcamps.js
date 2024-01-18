const express = require('express');

// Destructure controller
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
} = require('../controllers/bootcamps');

// Create express router instance
const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// Specify routes for methods
router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);


// Export routes
module.exports = router;
