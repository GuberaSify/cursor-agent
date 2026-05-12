const axios = require('axios');

const PIXABAY_BASE_URL = 'https://pixabay.com/api';

async function searchPixabay(query, { page = 1, perPage = 10 } = {}) {
  const apiKey = process.env.PIXABAY_API_KEY;

  if (!apiKey) {
    return { source: 'pixabay', images: [], error: 'PIXABAY_API_KEY not configured' };
  }

  try {
    const response = await axios.get(PIXABAY_BASE_URL, {
      params: { key: apiKey, q: query, page, per_page: perPage, image_type: 'photo' },
      timeout: 10000,
    });

    const images = response.data.hits.map((hit) => ({
      id: hit.id,
      source: 'pixabay',
      photographer: hit.user,
      description: hit.tags,
      url: hit.pageURL,
      thumbnail: hit.webformatURL,
      fullSize: hit.largeImageURL,
      width: hit.imageWidth,
      height: hit.imageHeight,
    }));

    return {
      source: 'pixabay',
      totalResults: response.data.totalHits,
      page,
      perPage,
      images,
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return { source: 'pixabay', images: [], error: message };
  }
}

module.exports = { searchPixabay };
