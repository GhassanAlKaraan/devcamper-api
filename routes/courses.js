const express = require('express');
const {
  getCourses,
//   getCourse,
//   addCourse,
//   updateCourse,
//   deleteCourse,
} = require('../controllers/courses');

// const course = require('../models/Course');

const router = express.Router({ mergeParams: true });

// const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getCourses);

// router.route('/:id')
//   .get(getCourse)
//   .put(protect, authorize('publisher', 'admin'), updateCourse)
//   .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;