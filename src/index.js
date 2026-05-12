const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const mode = process.env.USE_MOCK_AGENT === 'true' ? 'MOCK' : 'LIVE';
  console.log(`Cursor Agent Runner [${mode}] on port ${PORT}`);
});
