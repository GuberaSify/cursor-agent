const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  it('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'image-search-agent' });
  });
});

describe('GET /api/search', () => {
  it('returns 400 when query parameter is missing', async () => {
    const res = await request(app).get('/api/search');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('returns 400 when query is empty', async () => {
    const res = await request(app).get('/api/search?query=');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('returns 400 when query exceeds 200 characters', async () => {
    const longQuery = 'a'.repeat(201);
    const res = await request(app).get(`/api/search?query=${longQuery}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('200 characters');
  });

  it('returns 400 when page is not a positive integer', async () => {
    const res = await request(app).get('/api/search?query=cats&page=-1');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('positive integer');
  });

  it('returns 400 when per_page exceeds 80', async () => {
    const res = await request(app).get('/api/search?query=cats&per_page=100');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('between 1 and 80');
  });

  it('returns valid JSON response with correct structure when API keys missing', async () => {
    const originalPexels = process.env.PEXELS_API_KEY;
    const originalPixabay = process.env.PIXABAY_API_KEY;
    delete process.env.PEXELS_API_KEY;
    delete process.env.PIXABAY_API_KEY;

    const res = await request(app).get('/api/search?query=nature');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('query', 'nature');
    expect(res.body).toHaveProperty('totalResults');
    expect(res.body).toHaveProperty('sources');
    expect(res.body).toHaveProperty('images');
    expect(res.body.sources).toHaveProperty('pexels');
    expect(res.body.sources).toHaveProperty('pixabay');
    expect(res.body.sources.pexels.error).toContain('not configured');
    expect(res.body.sources.pixabay.error).toContain('not configured');

    process.env.PEXELS_API_KEY = originalPexels;
    process.env.PIXABAY_API_KEY = originalPixabay;
  });
});
