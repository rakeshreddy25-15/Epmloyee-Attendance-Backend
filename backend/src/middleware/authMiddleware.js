const jwt = require('jsonwebtoken');

function jwtAuth(req, res, next) {
  const auth = req.header('authorization');
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid Authorization format' });
  }
  
  const token = parts[1];
  const secret = process.env.JWT_SECRET || '';
  if (!secret) return res.status(500).json({ message: 'JWT_SECRET not configured' });

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { jwtAuth };
