const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');

router.route('/').get(getActivityLogs);

module.exports = router;
