const { Router } = require('express');
const { createClient } = require('../client');

const router = Router();

router.post('/agents/run', async (req, res, next) => {
  try {
    const { prompt, repository, branch, model, skills, rules, wait } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'The "prompt" field is required and must be a non-empty string.',
      });
    }

    const client = createClient();
    const agent = await client.createAgent({ prompt, repository, branch, model, skills, rules });

    if (wait) {
      const completed = await client.pollUntilComplete(agent.id);
      return res.json({ success: true, agent: completed });
    }

    res.status(202).json({ success: true, agent });
  } catch (error) {
    next(error);
  }
});

router.get('/agents/:id', async (req, res, next) => {
  try {
    const client = createClient();
    const agent = await client.getAgent(req.params.id);
    res.json({ success: true, agent });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Not Found', message: `Agent ${req.params.id} not found` });
    }
    next(error);
  }
});

router.post('/agents/:id/poll', async (req, res, next) => {
  try {
    const { interval, maxAttempts } = req.body || {};
    const client = createClient();
    const agent = await client.pollUntilComplete(req.params.id, { interval, maxAttempts });
    res.json({ success: true, agent });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Not Found', message: `Agent ${req.params.id} not found` });
    }
    next(error);
  }
});

module.exports = router;
