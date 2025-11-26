const express = require('express');
const router = express.Router();
const {
  getAvailability,
  getTechnicianAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability
} = require('../controllers/availabilityController');
const validateObjectId = require('../middleware/validateObjectId');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAvailability)
  .post(requireAuth, requireRole('ADMIN', 'PLANNER'), createAvailability);

router.route('/technician/:technicianId')
  .get(getTechnicianAvailability);

router.route('/:id')
  .put(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), updateAvailability)
  .delete(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), deleteAvailability);

module.exports = router;
