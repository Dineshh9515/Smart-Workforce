const express = require('express');
const router = express.Router();
const {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getLocations)
  .post(createLocation);

router.route('/:id')
  .get(validateObjectId, getLocationById)
  .put(validateObjectId, updateLocation)
  .delete(validateObjectId, deleteLocation);

module.exports = router;
