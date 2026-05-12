const { searchPexels } = require('./pexels');
const { searchPixabay } = require('./pixabay');

async function searchImages(query, options = {}) {
  const [pexelsResult, pixabayResult] = await Promise.allSettled([
    searchPexels(query, options),
    searchPixabay(query, options),
  ]);

  const pexels = pexelsResult.status === 'fulfilled'
    ? pexelsResult.value
    : { source: 'pexels', images: [], error: pexelsResult.reason?.message };

  const pixabay = pixabayResult.status === 'fulfilled'
    ? pixabayResult.value
    : { source: 'pixabay', images: [], error: pixabayResult.reason?.message };

  const allImages = [...(pexels.images || []), ...(pixabay.images || [])];

  return {
    query,
    totalResults: allImages.length,
    sources: {
      pexels: {
        totalResults: pexels.totalResults || 0,
        count: pexels.images?.length || 0,
        error: pexels.error || null,
      },
      pixabay: {
        totalResults: pixabay.totalResults || 0,
        count: pixabay.images?.length || 0,
        error: pixabay.error || null,
      },
    },
    images: allImages,
  };
}

module.exports = { searchImages };
