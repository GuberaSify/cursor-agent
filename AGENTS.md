# AGENTS.md

## Cursor Cloud specific instructions

This is a Node.js/Express image search agent that queries Pexels and Pixabay APIs.

### Quick reference

- **Install deps:** `npm install`
- **Dev server:** `npm run dev` (uses nodemon for hot-reload on port 3000)
- **Tests:** `npm test`
- **Lint:** `npm run lint`

### Key notes

- The app gracefully handles missing API keys — it returns error messages in the response rather than crashing. This means you can start the server and test the endpoint structure without API keys configured.
- Both external API services (Pexels, Pixabay) are queried in parallel via `Promise.allSettled`, so one failing does not block the other.
- Environment variables are loaded from `.env` via `dotenv` (file not committed — copy `.env.example`).
- The test suite uses `supertest` for HTTP-level integration tests and does not require live API keys.
