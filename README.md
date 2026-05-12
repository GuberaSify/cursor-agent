# Topic Explainer Agent

An agent that accepts a topic from the user and returns a detailed explanation as a JSON object. Uses Wikipedia's REST API to provide accurate explanations for any topic.

## Features

- Get explanations for any topic via a simple API call
- Returns structured JSON with summary, description, source URL, and thumbnail
- Input validation and meaningful error messages
- No API key required — uses Wikipedia's free public API

## Setup

### Prerequisites

- Node.js >= 18

### Installation

```bash
npm install
```

## Usage

### Start the server

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

### API Endpoints

#### Health Check

```
GET /health
```

#### Get Explanation for a Topic

```
GET /api/explain?topic=<your_topic>
```

**Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `topic` | Yes | The topic to explain (max 300 chars) |

**Example Request:**

```bash
curl "http://localhost:3000/api/explain?topic=quantum+computing"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "topic": "Quantum computing",
    "summary": "A quantum computer is a computer that exploits quantum mechanical phenomena...",
    "description": "Exploitation of quantum phenomena to perform computation",
    "url": "https://en.wikipedia.org/wiki/Quantum_computing",
    "thumbnail": "https://upload.wikimedia.org/..."
  }
}
```

**Error Response (topic not found):**

```json
{
  "error": "Not Found",
  "message": "No explanation found for topic: \"xyzabc\""
}
```

## Development

```bash
# Run tests
npm test

# Run linter
npm run lint

# Start dev server with hot-reload
npm run dev
```

## License

MIT
