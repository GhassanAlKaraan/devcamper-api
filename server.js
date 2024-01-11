const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

const PORT = process.env.PORT || 5000; // if not available for some reason
const ENVIR = process.env.NODE_ENV;

app.listen(
  PORT,
  console.log(`Server running in ${ENVIR} mode on port ${PORT}`)
);
