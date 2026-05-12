const { Router } = require('express');
const { createClient } = require('../client');

const router = Router();

router.post('/webhooks/github', async (req, res, next) => {
  try {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    if (!event) {
      return res.status(400).json({ error: 'Missing x-github-event header' });
    }

    const promptMap = {
      issues: buildIssuePrompt,
      pull_request: buildPRPrompt,
      push: buildPushPrompt,
    };

    const builder = promptMap[event];
    if (!builder) {
      return res.status(200).json({ message: `Event "${event}" ignored` });
    }

    const { prompt, repository, branch } = builder(payload);
    const client = createClient();
    const agent = await client.createAgent({ prompt, repository, branch });

    res.status(202).json({
      success: true,
      message: `Agent triggered for ${event} event`,
      agent,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/webhooks/schedule', async (req, res, next) => {
  try {
    const { prompt, repository, branch, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Validation Error', message: '"prompt" is required' });
    }

    const client = createClient();
    const agent = await client.createAgent({ prompt, repository, branch, model });

    res.status(202).json({
      success: true,
      message: 'Scheduled agent triggered',
      agent,
    });
  } catch (error) {
    next(error);
  }
});

function buildIssuePrompt(payload) {
  const issue = payload.issue || {};
  const repo = payload.repository || {};
  return {
    prompt: `Investigate and fix issue #${issue.number}: "${issue.title}"\n\n${issue.body || ''}`,
    repository: repo.full_name,
    branch: repo.default_branch || 'main',
  };
}

function buildPRPrompt(payload) {
  const pr = payload.pull_request || {};
  const repo = payload.repository || {};
  return {
    prompt: `Review pull request #${pr.number}: "${pr.title}"\n\n${pr.body || ''}`,
    repository: repo.full_name,
    branch: pr.head?.ref || 'main',
  };
}

function buildPushPrompt(payload) {
  const repo = payload.repository || {};
  const commits = payload.commits || [];
  const messages = commits.map((c) => `- ${c.message}`).join('\n');
  return {
    prompt: `Run tests and lint for the following commits:\n${messages}`,
    repository: repo.full_name,
    branch: (payload.ref || '').replace('refs/heads/', ''),
  };
}

module.exports = router;
