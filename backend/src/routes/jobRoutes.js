const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  assignJob,
  deleteJob,
  getJobSummary,
  getTechnicianWorkload
} = require('../controllers/jobController');
const validateObjectId = require('../middleware/validateObjectId');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.route('/summary').get(getJobSummary);
router.route('/workload-summary').get(getTechnicianWorkload);

router.route('/')
  .get(getJobs)
  .post(requireAuth, requireRole('ADMIN', 'PLANNER'), createJob);

router.route('/:id')
  .get(validateObjectId, getJobById)
  .put(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), updateJob)
  .delete(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), deleteJob);

router.route('/:id/assign')
  .patch(validateObjectId, requireAuth, requireRole('ADMIN', 'PLANNER'), assignJob);

module.exports = router;
