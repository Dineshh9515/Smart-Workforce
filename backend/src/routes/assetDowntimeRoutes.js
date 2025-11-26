const express = require('express');
const router = express.Router();
const {
  getAssetDowntime,
  getDowntimeById,
  createDowntime,
  updateDowntime,
  deleteDowntime,
  getDowntimeSummary
} = require('../controllers/assetDowntimeController');
const validateObjectId = require('../middleware/validateObjectId');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.route('/summary').get(getDowntimeSummary);

router.route('/')
  .get(getAssetDowntime)
  .post(requireAuth, requireRole('ADMIN', 'PLANNER'), createDowntime);

router.route('/:id')
  .get(validateObjectId, getDowntimeById)
  .put(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), updateDowntime)
  .delete(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), deleteDowntime);

module.exports = router;
