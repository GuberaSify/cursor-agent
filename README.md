# Cursor Agent Runner

A programmatic runner that exposes your own application endpoints to trigger [Cursor Cloud Agents](https://docs.cursor.com). Use it to integrate Cursor's AI agents into your CI/CD pipelines, GitHub webhooks, scheduled jobs, or any HTTP-based automation.

## Architecture

```
┌──────────────────┐         ┌─────────────────────┐         ┌──────────────────┐
│  Your App / CI   │──POST──▶│  Cursor Agent Runner │──POST──▶│ Cursor Cloud API │
│  (GitHub, Cron)  │         │   (this service)     │         │  /v0/agents      │
└──────────────────┘         └─────────────────────┘         └──────────────────┘
```

## Features

- **REST API** to create and monitor Cursor Cloud Agents programmatically
- **GitHub Webhook** handler — auto-triggers agents on issues, PRs, and pushes
- **Schedule endpoint** — trigger agents from cron jobs or automation platforms
- **Sync & Async modes** — fire-and-forget or wait for completion
- **Mock mode** — test locally without a Cursor API key

## Setup

### Prerequisites

- Node.js >= 18
- A Cursor API key (for live mode) — or use mock mode for testing

### Installation

```bash
npm install
cp .env.example .env
```

### Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CURSOR_API_KEY` | For live mode | — | Your Cursor API key |
| `CURSOR_API_BASE_URL` | No | `https://api.cursor.com/v0` | API base URL |
| `USE_MOCK_AGENT` | No | `false` | Set to `true` for local testing |
| `PORT` | No | `3000` | Server port |

## Usage

### Start the server

```bash
# Mock mode (no API key needed)
USE_MOCK_AGENT=true npm run dev

# Live mode (requires CURSOR_API_KEY)
npm run dev
```

### API Endpoints

#### 1. Trigger an Agent

```bash
POST /api/agents/run
```

**Body:**
```json
{
  "prompt": "Fix the login bug in src/auth.js",
  "repository": "myorg/myrepo",
  "branch": "main",
  "model": "claude-sonnet",
  "wait": false
}
```

- `wait: false` (default) → returns immediately with status `202` and agent ID
- `wait: true` → blocks until agent completes, returns final result

**Async response (202):**
```json
{
  "success": true,
  "agent": {
    "id": "agent-uuid",
    "status": "running",
    "prompt": "Fix the login bug...",
    "source": { "repository": "myorg/myrepo", "branch": "main" }
  }
}
```

#### 2. Check Agent Status

```bash
GET /api/agents/:id
```

#### 3. Poll Until Complete

```bash
POST /api/agents/:id/poll
```

#### 4. GitHub Webhook

```bash
POST /api/webhooks/github
```

Point your GitHub webhook URL here. Supported events:
- `issues` → creates agent to investigate/fix the issue
- `pull_request` → creates agent to review the PR
- `push` → creates agent to run tests/lint

#### 5. Scheduled Trigger

```bash
POST /api/webhooks/schedule
```

Call from a cron job or automation platform:
```bash
curl -X POST http://localhost:3000/api/webhooks/schedule \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Run nightly tests", "repository": "org/repo", "branch": "main"}'
```

## Testing

```bash
# Run tests (uses mock client automatically)
npm test

# Lint
npm run lint
```

## Integration Examples

### GitHub Actions

```yaml
on:
  issues:
    types: [opened]

jobs:
  trigger-agent:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST ${{ secrets.AGENT_RUNNER_URL }}/api/agents/run \
            -H "Content-Type: application/json" \
            -d '{"prompt": "Investigate issue: ${{ github.event.issue.title }}", "repository": "${{ github.repository }}", "wait": true}'
```

### Cron / Scheduled

```bash
# Every night at 2am — trigger agent to run test suite
0 2 * * * curl -X POST http://your-server/api/webhooks/schedule \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Run full test suite and report failures", "repository": "org/repo"}'
```

### From Your Application Code

```javascript
const axios = require('axios');

const response = await axios.post('http://localhost:3000/api/agents/run', {
  prompt: 'Refactor the payment module for better error handling',
  repository: 'myorg/myrepo',
  branch: 'main',
  wait: true,
});

console.log(response.data.agent.result);
```

## Development

```bash
npm run dev     # Start with hot-reload (mock mode by default)
npm test        # Run test suite
npm run lint    # Run ESLint
```

## License

MIT
