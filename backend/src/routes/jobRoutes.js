const express = require('express');
const router = express.Router();
const { getJobs, getJobById } = require('../controllers/jobController');
const { validateJobQuery } = require('../middleware/validateQuery');

router.get('/', validateJobQuery, getJobs);
router.get('/:id', getJobById);

module.exports = router;
