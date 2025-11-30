const { Router } = require('express');
const { healthRouter } = require('./health');
const { authRouter } = require('./auth');
const { attendanceRouter } = require('./attendance');
const dashboardRoutes = require('./dashboard');

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/attendance', attendanceRouter);
router.use('/dashboard', dashboardRoutes);

module.exports = { router };
