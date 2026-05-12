require('dotenv').config();
const express = require('express');
const explainRouter = require('./routes/explain');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'topic-explainer-agent' });
});

app.use('/api', explainRouter);

app.use(errorHandler);

module.exports = app;
