const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI; // || <Put URL here>

const connectDB = async () => {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
