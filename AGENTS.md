# AGENTS.md

## Cursor Cloud specific instructions

This is a Node.js/Express topic explainer agent that fetches explanations from Wikipedia's REST API.

### Quick reference

- **Install deps:** `npm install`
- **Dev server:** `npm run dev` (uses nodemon for hot-reload on port 3000)
- **Tests:** `npm test`
- **Lint:** `npm run lint`

### Key notes

- No API keys required — uses Wikipedia's free public REST API (`/api/rest_v1/page/summary`).
- The test suite makes live HTTP calls to Wikipedia; tests require network access.
- Environment variables loaded from `.env` via `dotenv` (optional, only `PORT` is configurable).
- The app returns 404 with a clear message when a topic is not found on Wikipedia.
