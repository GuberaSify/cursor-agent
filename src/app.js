require('dotenv').config();
const express = require('express');
const agentsRouter = require('./routes/agents');
const webhooksRouter = require('./routes/webhooks');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'cursor-agent-runner',
    mode: process.env.USE_MOCK_AGENT === 'true' ? 'mock' : 'live',
  });
});

app.use('/api', agentsRouter);
app.use('/api', webhooksRouter);

app.use(errorHandler);

module.exports = app;
