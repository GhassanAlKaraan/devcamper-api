const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI; // || 'mongodb+srv://ghassan:ghassan-P%40ssw0rd@cluster0.szfzicc.mongodb.net/devcamper?retryWrites=true&w=majority';

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
