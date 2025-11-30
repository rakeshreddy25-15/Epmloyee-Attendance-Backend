const { Attendance } = require('../models/Attendance');
const { User } = require('../models/User');
const mongoose = require('mongoose');

function todayDateString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

async function checkIn(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const date = todayDateString();
  const existing = await Attendance.findOne({ user: userId, date }).exec();
  if (existing && existing.checkIn) return res.status(400).json({ message: 'Already checked in' });

  if (existing) {
    existing.checkIn = new Date();
    await existing.save();
    return res.json(existing);
  }

  const att = new Attendance({ user: userId, date, checkIn: new Date() });
  await att.save();
  res.status(201).json(att);
}

async function checkOut(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const date = todayDateString();
  const existing = await Attendance.findOne({ user: userId, date }).exec();
  if (!existing || !existing.checkIn) return res.status(400).json({ message: 'Not checked in' });
  if (existing.checkOut) return res.status(400).json({ message: 'Already checked out' });

  existing.checkOut = new Date();
  await existing.save();
  res.json(existing);
}

async function myHistory(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const records = await Attendance.find({ user: userId }).sort({ date: -1 }).limit(200).exec();
  res.json(records);
}

async function mySummary(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const month = req.query.month;
  const m = month || new Date().toISOString().slice(0, 7);

  const regex = new RegExp('^' + m);
  const count = await Attendance.countDocuments({ user: userId, date: { $regex: regex } }).exec();
  res.json({ month: m, daysPresent: count });
}

async function todayStatus(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const date = todayDateString();
  const record = await Attendance.findOne({ user: userId, date }).exec();
  res.json({ 
    date, 
    status: record ? (record.checkIn ? (record.checkOut ? 'checked-out' : 'checked-in') : 'none') : 'none', 
    record 
  });
}

// Manager endpoints
async function allAttendance(req, res) {
  const list = await Attendance.find().populate('user', 'username role').sort({ date: -1 }).limit(1000).exec();
  res.json(list);
}

async function employeeAttendance(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }
  const list = await Attendance.find({ user: id }).sort({ date: -1 }).exec();
  res.json(list);
}

async function teamSummary(req, res) {
  const date = todayDateString();
  const present = await Attendance.find({ date }).populate('user', 'username role').exec();
  const byRole = {};
  present.forEach(p => {
    const r = p.user?.role || 'unknown';
    byRole[r] = (byRole[r] || 0) + 1;
  });
  res.json({ date, presentCount: present.length, byRole });
}

async function exportCSV(req, res) {
  const rows = await Attendance.find().populate('user', 'username email').limit(5000).exec();
  const header = 'username,email,date,checkIn,checkOut\n';
  const lines = rows.map(r => `${r.user?.username || ''},${r.user?.email || ''},${r.date},${r.checkIn?.toISOString() || ''},${r.checkOut?.toISOString() || ''}`);
  const csv = header + lines.join('\n');
  res.header('Content-Type', 'text/csv');
  res.attachment('attendance.csv');
  res.send(csv);
}

async function todayStatusAll(req, res) {
  const date = todayDateString();
  const present = await Attendance.find({ date }).populate('user', 'username role').exec();
  res.json(present.map(p => ({ username: p.user?.username, role: p.user?.role, checkIn: p.checkIn, checkOut: p.checkOut })));
}

module.exports = { 
  checkIn, checkOut, myHistory, mySummary, todayStatus, 
  allAttendance, employeeAttendance, teamSummary, exportCSV, todayStatusAll 
};
