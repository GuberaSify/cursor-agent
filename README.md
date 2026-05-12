# Image Search Agent

An agent that accepts user search queries and fetches images from multiple image repositories (Pexels and Pixabay), returning combined results as a JSON object.

## Features

- Search images across Pexels and Pixabay simultaneously
- Unified JSON response format from all sources
- Pagination support
- Input validation and error handling
- Graceful degradation when individual APIs are unavailable

## Setup

### Prerequisites

- Node.js >= 18
- API keys from [Pexels](https://www.pexels.com/api/) and [Pixabay](https://pixabay.com/api/docs/)

### Installation

```bash
npm install
```

### Configuration

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```
PEXELS_API_KEY=your_pexels_api_key
PIXABAY_API_KEY=your_pixabay_api_key
PORT=3000
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

#### Search Images

```
GET /api/search?query=<search_term>&page=<page>&per_page=<count>
```

**Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `query` | Yes | - | Search term (max 200 chars) |
| `page` | No | 1 | Page number |
| `per_page` | No | 10 | Results per page per source (1-80) |

**Example Request:**

```bash
curl "http://localhost:3000/api/search?query=sunset&per_page=5"
```

**Example Response:**

```json
{
  "query": "sunset",
  "totalResults": 10,
  "sources": {
    "pexels": { "totalResults": 8000, "count": 5, "error": null },
    "pixabay": { "totalResults": 5000, "count": 5, "error": null }
  },
  "images": [
    {
      "id": 12345,
      "source": "pexels",
      "photographer": "John Doe",
      "description": "Beautiful sunset over ocean",
      "url": "https://www.pexels.com/photo/...",
      "thumbnail": "https://images.pexels.com/...",
      "fullSize": "https://images.pexels.com/...",
      "width": 1920,
      "height": 1080
    }
  ]
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
