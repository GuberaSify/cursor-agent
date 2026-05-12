require('dotenv').config();
const express = require('express');
const searchRouter = require('./routes/search');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'image-search-agent' });
});

app.use('/api', searchRouter);

app.use(errorHandler);

module.exports = app;
