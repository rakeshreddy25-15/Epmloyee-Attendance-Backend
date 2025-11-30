const { Router } = require('express');
const { register, login, me } = require('../controllers/authController');
const { jwtAuth } = require('../middleware/authMiddleware');

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', jwtAuth, me);

module.exports = { authRouter };
