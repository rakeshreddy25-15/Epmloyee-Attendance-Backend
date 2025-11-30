require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { router: apiRouter } = require('./routes');
const { logger } = require('./logger');
const { connectDB } = require('./db');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err?.message || 'Unknown error');
  res.status(err?.status || 500).json({ message: err?.message || 'Internal Server Error' });
});

async function start() {
  const mongo = process.env.MONGO_URI || '';
  if (!mongo) {
    logger.error('MONGO_URI not set in .env');
    process.exit(1);
  }
  await connectDB(mongo);
  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

start();
