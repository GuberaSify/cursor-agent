const axios = require('axios');

const DEFAULT_BASE_URL = 'https://api.cursor.com/v0';

class CursorAgentClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.CURSOR_API_KEY;
    this.baseUrl = options.baseUrl || process.env.CURSOR_API_BASE_URL || DEFAULT_BASE_URL;
    this.timeout = options.timeout || 30000;

    this.http = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      },
    });
  }

  async createAgent({ prompt, repository, branch, model, skills, rules }) {
    const payload = {
      prompt,
      source: {},
    };

    if (repository) {
      payload.source.repository = repository;
    }
    if (branch) {
      payload.source.branch = branch;
    }
    if (model) {
      payload.model = model;
    }
    if (skills) {
      payload.skills = skills;
    }
    if (rules) {
      payload.rules = rules;
    }

    const response = await this.http.post('/agents', payload);
    return response.data;
  }

  async getAgent(agentId) {
    const response = await this.http.get(`/agents/${agentId}`);
    return response.data;
  }

  async pollUntilComplete(agentId, { interval = 5000, maxAttempts = 60 } = {}) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const agent = await this.getAgent(agentId);

      if (agent.status === 'completed' || agent.status === 'failed' || agent.status === 'cancelled') {
        return agent;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Agent ${agentId} did not complete within ${maxAttempts * interval / 1000}s`);
  }
}

module.exports = { CursorAgentClient };
