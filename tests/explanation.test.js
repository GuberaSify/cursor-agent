const { getExplanation } = require('../src/services/explanation');

describe('Explanation Service', () => {
  it('returns explanation for a known topic', async () => {
    const result = await getExplanation('Python (programming language)');
    expect(result).not.toBeNull();
    expect(result.topic).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.summary.length).toBeGreaterThan(50);
    expect(result.url).toContain('wikipedia.org');
  }, 15000);

  it('returns null for unknown topic', async () => {
    const result = await getExplanation('xyznonexistenttopic99999zzz');
    expect(result).toBeNull();
  }, 15000);

  it('handles whitespace in topic', async () => {
    const result = await getExplanation('  Node.js  ');
    expect(result).not.toBeNull();
    expect(result.summary.length).toBeGreaterThan(0);
  }, 15000);
});
