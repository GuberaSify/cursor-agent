const { Router } = require('express');
const { searchImages } = require('../services/imageSearch');
const { validateSearchQuery } = require('../middleware/validateInput');

const router = Router();

router.get('/search', validateSearchQuery, async (req, res, next) => {
  try {
    const { query, page = 1, per_page = 10 } = req.query;
    const results = await searchImages(query, { page: Number(page), perPage: Number(per_page) });
    res.json(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
