// server.js or apiRoutes.js
import express from 'express';
import GoogleAnalyticsClient from '../googleAnalytics.js';

const router = express.Router();
const gaClient = new GoogleAnalyticsClient();

// Fetch analytics data
router.get('/analytics', async (req, res) => {
  const { pageId, startDate, endDate } = req.query;

  if (!pageId || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'Missing parameters.' });
  }

  try {
    const metrics = await gaClient.getMetrics(pageId, startDate, endDate);
    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics.' });
  }
});

export default router;
