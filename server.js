// Load required dependencies
const express = require('express');
const dotenv = require('dotenv');

// Load route files
const bootcamps = require('./routes/bootcamps');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Create an express instance
const app = express();

// Logging middleware
const logger = (req, res, next)=>{
  req.hello = 'Hello World';
  console.log('Middleware ran');
  next();
}
app.use(logger);


// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Assign evn vars
const PORT = process.env.PORT || 5000; // if not available for some reason
const ENVIR = process.env.NODE_ENV;

// Express listener
app.listen(
  PORT,
  console.log(`Server running in ${ENVIR} mode on port ${PORT}`)
);
