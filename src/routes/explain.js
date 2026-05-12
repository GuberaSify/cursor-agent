const { Router } = require('express');
const { getExplanation } = require('../services/explanation');

const router = Router();

router.get('/explain', async (req, res, next) => {
  try {
    const { topic } = req.query;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'The "topic" query parameter is required and must be a non-empty string.',
      });
    }

    if (topic.length > 300) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'The "topic" parameter must be 300 characters or fewer.',
      });
    }

    const result = await getExplanation(topic);

    if (!result) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No explanation found for topic: "${topic}"`,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
