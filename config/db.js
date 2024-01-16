const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = async () => {

  const conn = await mongoose.connect(process.env.MONGODB_URI);
  
  console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
