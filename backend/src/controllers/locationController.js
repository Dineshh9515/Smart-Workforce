const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({ isActive: true });
    res.json(locations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
const getLocationById = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (location) {
      res.json(location);
    } else {
      res.status(404);
      throw new Error('Location not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a location
// @route   POST /api/locations
// @access  Public
const createLocation = async (req, res, next) => {
  try {
    const { name, code, address, city, country } = req.body;

    const locationExists = await Location.findOne({ code });
    if (locationExists) {
      res.status(400);
      throw new Error('Location code already exists');
    }

    const location = await Location.create({
      name,
      code,
      address,
      city,
      country
    });

    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Public
const updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);

    if (location) {
      location.name = req.body.name || location.name;
      location.code = req.body.code || location.code;
      location.address = req.body.address || location.address;
      location.city = req.body.city || location.city;
      location.country = req.body.country || location.country;

      const updatedLocation = await location.save();
      res.json(updatedLocation);
    } else {
      res.status(404);
      throw new Error('Location not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete location (soft delete)
// @route   DELETE /api/locations/:id
// @access  Public
const deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);

    if (location) {
      location.isActive = false;
      await location.save();
      res.json({ message: 'Location removed (soft delete)' });
    } else {
      res.status(404);
      throw new Error('Location not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
};
