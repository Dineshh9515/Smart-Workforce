const express = require('express');
const router = express.Router();
const {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');
const validateObjectId = require('../middleware/validateObjectId');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAssets)
  .post(requireAuth, requireRole('ADMIN', 'PLANNER'), createAsset);

router.route('/:id')
  .get(validateObjectId, getAssetById)
  .put(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), updateAsset)
  .delete(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), deleteAsset);

module.exports = router;
