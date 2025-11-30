const { Attendance } = require('../models/Attendance');

async function employeeStats(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const total = await Attendance.countDocuments({ user: userId }).exec();
  res.json({ totalDaysRecorded: total });
}

async function managerStats(req, res) {
  const totalToday = await Attendance.countDocuments({ date: new Date().toISOString().slice(0, 10) }).exec();
  res.json({ totalCheckedInToday: totalToday });
}

module.exports = { employeeStats, managerStats };
