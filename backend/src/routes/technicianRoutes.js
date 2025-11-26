const express = require('express');
const router = express.Router();
const {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician
} = require('../controllers/technicianController');
const validateObjectId = require('../middleware/validateObjectId');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTechnicians)
  .post(requireAuth, requireRole('ADMIN', 'PLANNER'), createTechnician);

router.route('/:id')
  .get(validateObjectId, getTechnicianById)
  .put(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), updateTechnician)
  .delete(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), deleteTechnician);

module.exports = router;
