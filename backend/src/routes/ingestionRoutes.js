const express = require('express');
const router = express.Router();
const { runIngestion, getIngestionStatus } = require('../controllers/ingestionController');

router.post('/run', runIngestion);
router.get('/status', getIngestionStatus);

module.exports = router;
