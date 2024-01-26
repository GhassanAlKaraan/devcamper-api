const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const path = require('path');

//! Load configs
dotenv.config({ path: './config/config.env' }); //1 Load env vars
connectDB(); //2 Connect to Database

//! Load route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

//! Prepare express app
const app = express();
const PORT = process.env.PORT || 5000;
const ENVIR = process.env.NODE_ENV;

//! Mount middleware

//* Mount body parser
app.use(express.json());

//* Mount cookie parser
app.use(cookieParser());

//* Mount Dev logging middleware
if (ENVIR === 'development') { 
  app.use(morgan('dev'));
}

//* File uploading
app.use(fileupload());

//* Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//* Mount express routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

//* Mount error handler middleware (here's the correct place to add it)
app.use(errorHandler);

//! Express listener
const server = app.listen(
  PORT,
  console.log(`Server running in ${ENVIR} mode on port ${PORT}`.yellow.bold)
);

//! Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`(unhandledRejection) Error: ${err.message}`.red);
  // Close Server and close process
  server.close(() => process.exit(1));
});
