const { CursorAgentClient } = require('./cursorAgent');
const { MockCursorAgentClient } = require('./mockAgent');

let mockInstance = null;

function createClient(options = {}) {
  const useMock = options.mock || process.env.USE_MOCK_AGENT === 'true';

  if (useMock) {
    if (!mockInstance) {
      mockInstance = new MockCursorAgentClient();
    }
    return mockInstance;
  }

  return new CursorAgentClient(options);
}

function resetMockClient() {
  mockInstance = null;
}

module.exports = { createClient, CursorAgentClient, MockCursorAgentClient, resetMockClient };
