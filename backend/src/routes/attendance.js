const { Router } = require('express');
const { jwtAuth } = require('../middleware/authMiddleware');
const { 
  checkIn, checkOut, myHistory, mySummary, todayStatus,
  allAttendance, employeeAttendance, teamSummary, exportCSV, todayStatusAll 
} = require('../controllers/attendanceController');

const attendanceRouter = Router();

// Employee
attendanceRouter.post('/checkin', jwtAuth, checkIn);
attendanceRouter.post('/checkout', jwtAuth, checkOut);
attendanceRouter.get('/my-history', jwtAuth, myHistory);
attendanceRouter.get('/my-summary', jwtAuth, mySummary);
attendanceRouter.get('/today', jwtAuth, todayStatus);

// Manager
attendanceRouter.get('/all', jwtAuth, allAttendance);
attendanceRouter.get('/employee/:id', jwtAuth, employeeAttendance);
attendanceRouter.get('/summary', jwtAuth, teamSummary);
attendanceRouter.get('/export', jwtAuth, exportCSV);
attendanceRouter.get('/today-status', jwtAuth, todayStatusAll);

module.exports = { attendanceRouter };
