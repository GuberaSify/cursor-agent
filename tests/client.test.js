const { MockCursorAgentClient } = require('../src/client/mockAgent');

describe('MockCursorAgentClient', () => {
  let client;

  beforeEach(() => {
    client = new MockCursorAgentClient();
  });

  it('creates an agent with correct properties', async () => {
    const agent = await client.createAgent({
      prompt: 'Fix bug',
      repository: 'org/repo',
      branch: 'main',
    });

    expect(agent).toHaveProperty('id');
    expect(agent.status).toBe('running');
    expect(agent.prompt).toBe('Fix bug');
    expect(agent.source.repository).toBe('org/repo');
    expect(agent.source.branch).toBe('main');
  });

  it('agent transitions to completed after delay', async () => {
    const agent = await client.createAgent({ prompt: 'Task' });
    expect(agent.status).toBe('running');

    const completed = await client.pollUntilComplete(agent.id);
    expect(completed.status).toBe('completed');
    expect(completed.result).toHaveProperty('summary');
    expect(completed.completed_at).not.toBeNull();
  });

  it('getAgent throws for non-existent agent', async () => {
    await expect(client.getAgent('fake-id')).rejects.toThrow('Agent not found');
  });

  it('pollUntilComplete throws on timeout for non-existent agent', async () => {
    await expect(
      client.pollUntilComplete('fake-id', { interval: 100, maxAttempts: 2 })
    ).rejects.toThrow();
  });
});
