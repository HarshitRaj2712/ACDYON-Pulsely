const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host} (database: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection error: ${error.message}`);
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
