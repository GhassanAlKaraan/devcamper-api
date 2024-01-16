// Load required dependencies
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan'); // Logging middleware dependency
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });
// console.log(process.env);
// Connect to Database
connectDB();

// Load route files
const bootcamps = require('./routes/bootcamps');

// Create an express instance
const app = express();
// Assign evn vars
const PORT = process.env.PORT || 5000; // if not available for some reason
const ENVIR = process.env.NODE_ENV;

// Mount Body parser
app.use(express.json());


// Mount Dev logging middleware
if (ENVIR === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Express listener
const server = app.listen(
  PORT,
  console.log(`Server running in ${ENVIR} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise)=>{
  console.log(`Error: ${err.message}`.red);
  // Close Server and close process
  server.close(()=>process.exit(1));
});
