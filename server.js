// Load required dependencies
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Logging middleware dependency

// Load route files
const bootcamps = require('./routes/bootcamps');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Create an express instance
const app = express();
// Assign evn vars
const PORT = process.env.PORT || 5000; // if not available for some reason
const ENVIR = process.env.NODE_ENV;

// Mount Dev logging middleware
if(ENVIR === 'development'){
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Express listener
app.listen(
  PORT,
  console.log(`Server running in ${ENVIR} mode on port ${PORT}`)
);
