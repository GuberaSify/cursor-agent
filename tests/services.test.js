const { searchPexels } = require('../src/services/pexels');
const { searchPixabay } = require('../src/services/pixabay');
const { searchImages } = require('../src/services/imageSearch');

describe('Pexels Service', () => {
  it('returns error message when API key is not set', async () => {
    const original = process.env.PEXELS_API_KEY;
    delete process.env.PEXELS_API_KEY;

    const result = await searchPexels('cats');
    expect(result.source).toBe('pexels');
    expect(result.images).toEqual([]);
    expect(result.error).toContain('not configured');

    process.env.PEXELS_API_KEY = original;
  });
});

describe('Pixabay Service', () => {
  it('returns error message when API key is not set', async () => {
    const original = process.env.PIXABAY_API_KEY;
    delete process.env.PIXABAY_API_KEY;

    const result = await searchPixabay('dogs');
    expect(result.source).toBe('pixabay');
    expect(result.images).toEqual([]);
    expect(result.error).toContain('not configured');

    process.env.PIXABAY_API_KEY = original;
  });
});

describe('Image Search Service', () => {
  it('returns combined results from both sources', async () => {
    delete process.env.PEXELS_API_KEY;
    delete process.env.PIXABAY_API_KEY;

    const result = await searchImages('mountains');
    expect(result).toHaveProperty('query', 'mountains');
    expect(result).toHaveProperty('totalResults', 0);
    expect(result).toHaveProperty('sources');
    expect(result.sources.pexels).toHaveProperty('error');
    expect(result.sources.pixabay).toHaveProperty('error');
    expect(result).toHaveProperty('images');
    expect(Array.isArray(result.images)).toBe(true);
  });
});
