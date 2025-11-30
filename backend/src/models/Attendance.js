const { Schema, model } = require('mongoose');

const AttendanceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
}, { timestamps: true });

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = model('Attendance', AttendanceSchema);

module.exports = { Attendance };
