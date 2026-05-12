const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  it('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'topic-explainer-agent' });
  });
});

describe('GET /api/explain', () => {
  it('returns 400 when topic parameter is missing', async () => {
    const res = await request(app).get('/api/explain');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation Error');
    expect(res.body.message).toContain('topic');
  });

  it('returns 400 when topic is empty', async () => {
    const res = await request(app).get('/api/explain?topic=');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('returns 400 when topic exceeds 300 characters', async () => {
    const longTopic = 'a'.repeat(301);
    const res = await request(app).get(`/api/explain?topic=${longTopic}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('300 characters');
  });

  it('returns explanation for a valid topic', async () => {
    const res = await request(app).get('/api/explain?topic=JavaScript');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('topic');
    expect(res.body.data).toHaveProperty('summary');
    expect(res.body.data.summary.length).toBeGreaterThan(0);
    expect(res.body.data).toHaveProperty('url');
  }, 15000);

  it('returns 404 for a non-existent topic', async () => {
    const res = await request(app).get('/api/explain?topic=xyznonexistenttopic12345abc');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Not Found');
  }, 15000);
});
