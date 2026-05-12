const crypto = require('crypto');

class MockCursorAgentClient {
  constructor() {
    this.agents = new Map();
  }

  async createAgent({ prompt, repository, branch, model }) {
    const id = crypto.randomUUID();
    const agent = {
      id,
      status: 'running',
      prompt,
      source: { repository: repository || null, branch: branch || null },
      model: model || 'default',
      created_at: new Date().toISOString(),
      completed_at: null,
      result: null,
    };

    this.agents.set(id, agent);

    setTimeout(() => {
      const stored = this.agents.get(id);
      if (stored) {
        stored.status = 'completed';
        stored.completed_at = new Date().toISOString();
        stored.result = {
          summary: `Agent completed task for prompt: "${prompt.substring(0, 50)}..."`,
          changes: [],
          branch: branch || 'cursor/agent-run-' + id.substring(0, 8),
        };
      }
    }, 2000);

    return agent;
  }

  async getAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      const error = new Error('Agent not found');
      error.response = { status: 404 };
      throw error;
    }
    return agent;
  }

  async pollUntilComplete(agentId, { interval = 500, maxAttempts = 20 } = {}) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const agent = await this.getAgent(agentId);
      if (agent.status === 'completed' || agent.status === 'failed') {
        return agent;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error(`Agent ${agentId} did not complete within timeout`);
  }
}

module.exports = { MockCursorAgentClient };
