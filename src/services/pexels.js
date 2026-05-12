const axios = require('axios');

const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

async function searchPexels(query, { page = 1, perPage = 10 } = {}) {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    return { source: 'pexels', images: [], error: 'PEXELS_API_KEY not configured' };
  }

  try {
    const response = await axios.get(`${PEXELS_BASE_URL}/search`, {
      headers: { Authorization: apiKey },
      params: { query, page, per_page: perPage },
      timeout: 10000,
    });

    const images = response.data.photos.map((photo) => ({
      id: photo.id,
      source: 'pexels',
      photographer: photo.photographer,
      description: photo.alt || '',
      url: photo.url,
      thumbnail: photo.src.medium,
      fullSize: photo.src.original,
      width: photo.width,
      height: photo.height,
    }));

    return {
      source: 'pexels',
      totalResults: response.data.total_results,
      page: response.data.page,
      perPage: perPage,
      images,
    };
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return { source: 'pexels', images: [], error: message };
  }
}

module.exports = { searchPexels };
