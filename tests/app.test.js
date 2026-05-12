const request = require('supertest');

process.env.USE_MOCK_AGENT = 'true';
const app = require('../src/app');

describe('Health Check', () => {
  it('GET /health returns status with mock mode', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('cursor-agent-runner');
    expect(res.body.mode).toBe('mock');
  });
});

describe('POST /api/agents/run', () => {
  it('returns 400 when prompt is missing', async () => {
    const res = await request(app).post('/api/agents/run').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('returns 400 when prompt is empty', async () => {
    const res = await request(app).post('/api/agents/run').send({ prompt: '' });
    expect(res.statusCode).toBe(400);
  });

  it('creates agent and returns 202 (async mode)', async () => {
    const res = await request(app)
      .post('/api/agents/run')
      .send({
        prompt: 'Fix the login bug in auth.js',
        repository: 'myorg/myrepo',
        branch: 'main',
      });
    expect(res.statusCode).toBe(202);
    expect(res.body.success).toBe(true);
    expect(res.body.agent).toHaveProperty('id');
    expect(res.body.agent.status).toBe('running');
    expect(res.body.agent.prompt).toBe('Fix the login bug in auth.js');
  });

  it('creates agent and waits for completion (sync mode)', async () => {
    const res = await request(app)
      .post('/api/agents/run')
      .send({
        prompt: 'Add unit tests for utils.js',
        repository: 'myorg/myrepo',
        wait: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.agent.status).toBe('completed');
    expect(res.body.agent.result).toHaveProperty('summary');
  }, 15000);
});

describe('GET /api/agents/:id', () => {
  it('returns 404 for non-existent agent', async () => {
    const res = await request(app).get('/api/agents/nonexistent-id');
    expect(res.statusCode).toBe(404);
  });

  it('returns agent status after creation', async () => {
    const createRes = await request(app)
      .post('/api/agents/run')
      .send({ prompt: 'Test task' });
    const agentId = createRes.body.agent.id;

    const res = await request(app).get(`/api/agents/${agentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.agent.id).toBe(agentId);
  });
});
