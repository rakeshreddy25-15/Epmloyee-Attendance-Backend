const { Router } = require('express');
const { jwtAuth } = require('../middleware/authMiddleware');
const { employeeStats, managerStats } = require('../controllers/dashboardController');

const router = Router();

router.get('/employee', jwtAuth, employeeStats);
router.get('/manager', jwtAuth, managerStats);

module.exports = router;
