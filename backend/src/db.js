const mongoose = require('mongoose');
const { logger } = require('./logger');

async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection error: ' + (err?.message || 'Unknown'));
    process.exit(1);
  }
}

module.exports = { connectDB };
