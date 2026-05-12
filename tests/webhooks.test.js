const request = require('supertest');

process.env.USE_MOCK_AGENT = 'true';
const app = require('../src/app');

describe('POST /api/webhooks/github', () => {
  it('returns 400 when x-github-event header is missing', async () => {
    const res = await request(app).post('/api/webhooks/github').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Missing');
  });

  it('ignores unknown events', async () => {
    const res = await request(app)
      .post('/api/webhooks/github')
      .set('x-github-event', 'star')
      .send({});
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('ignored');
  });

  it('triggers agent for issue event', async () => {
    const res = await request(app)
      .post('/api/webhooks/github')
      .set('x-github-event', 'issues')
      .send({
        issue: { number: 42, title: 'Bug in login', body: 'Cannot log in' },
        repository: { full_name: 'org/repo', default_branch: 'main' },
      });
    expect(res.statusCode).toBe(202);
    expect(res.body.success).toBe(true);
    expect(res.body.agent).toHaveProperty('id');
    expect(res.body.agent.prompt).toContain('#42');
  });

  it('triggers agent for pull_request event', async () => {
    const res = await request(app)
      .post('/api/webhooks/github')
      .set('x-github-event', 'pull_request')
      .send({
        pull_request: { number: 10, title: 'Add feature X', body: 'Implements X', head: { ref: 'feat/x' } },
        repository: { full_name: 'org/repo' },
      });
    expect(res.statusCode).toBe(202);
    expect(res.body.agent.prompt).toContain('#10');
  });

  it('triggers agent for push event', async () => {
    const res = await request(app)
      .post('/api/webhooks/github')
      .set('x-github-event', 'push')
      .send({
        ref: 'refs/heads/main',
        commits: [{ message: 'fix: typo' }, { message: 'feat: add button' }],
        repository: { full_name: 'org/repo' },
      });
    expect(res.statusCode).toBe(202);
    expect(res.body.agent.prompt).toContain('fix: typo');
  });
});

describe('POST /api/webhooks/schedule', () => {
  it('returns 400 when prompt is missing', async () => {
    const res = await request(app).post('/api/webhooks/schedule').send({});
    expect(res.statusCode).toBe(400);
  });

  it('triggers scheduled agent', async () => {
    const res = await request(app)
      .post('/api/webhooks/schedule')
      .send({
        prompt: 'Run nightly lint and test suite',
        repository: 'org/repo',
        branch: 'main',
      });
    expect(res.statusCode).toBe(202);
    expect(res.body.success).toBe(true);
    expect(res.body.agent).toHaveProperty('id');
  });
});
