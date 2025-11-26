const AvailabilitySlot = require('../models/AvailabilitySlot');

// @desc    Get availability slots
// @route   GET /api/availability
// @access  Public
const getAvailability = async (req, res, next) => {
  try {
    const { technicianId, startDate, endDate } = req.query;
    const query = {};

    if (technicianId) query.technician = technicianId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const slots = await AvailabilitySlot.find(query)
      .populate('technician', 'name status')
      .sort({ date: 1 });

    res.json(slots);
  } catch (error) {
    next(error);
  }
};

// @desc    Get availability for specific technician
// @route   GET /api/availability/technician/:technicianId
// @access  Public
const getTechnicianAvailability = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { technician: req.params.technicianId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const slots = await AvailabilitySlot.find(query).sort({ date: 1 });
    res.json(slots);
  } catch (error) {
    next(error);
  }
};

// @desc    Create availability slot(s)
// @route   POST /api/availability
// @access  Public
const createAvailability = async (req, res, next) => {
  try {
    const { technician, date, shift, isAvailable, reason } = req.body;

    // Check if slot already exists
    const existingSlot = await AvailabilitySlot.findOne({ technician, date: new Date(date) });
    if (existingSlot) {
      res.status(400);
      throw new Error('Availability slot for this date already exists');
    }

    const slot = await AvailabilitySlot.create({
      technician,
      date: new Date(date),
      shift,
      isAvailable,
      reason
    });

    res.status(201).json(slot);
  } catch (error) {
    next(error);
  }
};

// @desc    Update availability slot
// @route   PUT /api/availability/:id
// @access  Public
const updateAvailability = async (req, res, next) => {
  try {
    const slot = await AvailabilitySlot.findById(req.params.id);

    if (slot) {
      slot.shift = req.body.shift || slot.shift;
      if (req.body.isAvailable !== undefined) slot.isAvailable = req.body.isAvailable;
      slot.reason = req.body.reason || slot.reason;

      const updatedSlot = await slot.save();
      res.json(updatedSlot);
    } else {
      res.status(404);
      throw new Error('Availability slot not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete availability slot
// @route   DELETE /api/availability/:id
// @access  Public
const deleteAvailability = async (req, res, next) => {
  try {
    const slot = await AvailabilitySlot.findById(req.params.id);

    if (slot) {
      await AvailabilitySlot.deleteOne({ _id: slot._id });
      res.json({ message: 'Availability slot removed' });
    } else {
      res.status(404);
      throw new Error('Availability slot not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailability,
  getTechnicianAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability
};
