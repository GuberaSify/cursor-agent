# AGENTS.md

## Cursor Cloud specific instructions

This is a Node.js/Express service that programmatically triggers Cursor Cloud Agents via REST endpoints.

### Quick reference

- **Install deps:** `npm install`
- **Dev server (mock mode):** `USE_MOCK_AGENT=true npm run dev` (port 3000, hot-reload via nodemon)
- **Tests:** `npm test` (uses mock client, no API key needed)
- **Lint:** `npm run lint`

### Key notes

- Set `USE_MOCK_AGENT=true` for local development/testing — no Cursor API key needed.
- The mock client simulates agent creation and auto-completes after 2 seconds.
- Tests always run in mock mode (set in test files via `process.env.USE_MOCK_AGENT = 'true'`).
- For live mode, set `CURSOR_API_KEY` in `.env` and ensure `USE_MOCK_AGENT` is unset or `false`.
- The `POST /api/agents/run` endpoint supports `wait: true` for synchronous polling.
- GitHub webhook handler at `POST /api/webhooks/github` auto-maps events to agent prompts.
