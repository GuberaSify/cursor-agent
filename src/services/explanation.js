const axios = require('axios');

const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary';

async function getExplanation(topic) {
  const encoded = encodeURIComponent(topic.trim());

  try {
    const response = await axios.get(`${WIKIPEDIA_API}/${encoded}`, {
      headers: { 'User-Agent': 'TopicExplainerAgent/1.0' },
      timeout: 10000,
    });

    const data = response.data;

    return {
      topic: data.title,
      summary: data.extract,
      description: data.description || null,
      url: data.content_urls?.desktop?.page || null,
      thumbnail: data.thumbnail?.source || null,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch explanation: ${error.message}`);
  }
}

module.exports = { getExplanation };
