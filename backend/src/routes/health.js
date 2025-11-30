const { Router } = require('express');

const healthRouter = Router();

healthRouter.get('/', (_, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

module.exports = { healthRouter };
