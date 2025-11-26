const Technician = require('../models/Technician');
const Job = require('../models/Job');
const { createLog } = require('./activityLogController');

// @desc    Get all technicians
// @route   GET /api/technicians
// @access  Public
const getTechnicians = async (req, res, next) => {
  try {
    const { search, locationId, status, skill, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (locationId) {
      query.location = locationId;
    }

    if (status) {
      query.status = status;
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    // Exclude inactive unless specifically asked for? 
    // For now, let's show all except Inactive unless status is specified
    if (!status) {
        query.status = { $ne: 'Inactive' };
    }

    const count = await Technician.countDocuments(query);
    const technicians = await Technician.find(query)
      .populate('location', 'name code')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({
      technicians,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalTechnicians: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single technician
// @route   GET /api/technicians/:id
// @access  Public
const getTechnicianById = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id).populate('location');
    if (technician) {
      res.json(technician);
    } else {
      res.status(404);
      throw new Error('Technician not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a technician
// @route   POST /api/technicians
// @access  Public
const createTechnician = async (req, res, next) => {
  try {
    const { name, email, phone, role, primarySkill, skills, location, status, shiftType } = req.body;

    const technicianExists = await Technician.findOne({ email });
    if (technicianExists) {
      res.status(400);
      throw new Error('Technician already exists');
    }

    const technician = await Technician.create({
      name,
      email,
      phone,
      role,
      primarySkill,
      skills,
      location,
      status,
      shiftType
    });

    res.status(201).json(technician);
  } catch (error) {
    next(error);
  }
};

// @desc    Update technician
// @route   PUT /api/technicians/:id
// @access  Public
const updateTechnician = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id);

    if (technician) {
      technician.name = req.body.name || technician.name;
      technician.email = req.body.email || technician.email;
      technician.phone = req.body.phone || technician.phone;
      technician.role = req.body.role || technician.role;
      technician.primarySkill = req.body.primarySkill || technician.primarySkill;
      technician.skills = req.body.skills || technician.skills;
      technician.location = req.body.location || technician.location;
      technician.status = req.body.status || technician.status;
      technician.shiftType = req.body.shiftType || technician.shiftType;

      // Log status change
      if (req.body.status && req.body.status !== technician.status) {
        await createLog({
          type: 'TECHNICIAN_STATUS_CHANGED',
          message: `Technician "${technician.name}" status changed to ${req.body.status}`,
          entityType: 'Technician',
          entityId: technician._id,
          metadata: { oldStatus: technician.status, newStatus: req.body.status }
        });
      }

      const updatedTechnician = await technician.save();
      res.json(updatedTechnician);
    } else {
      res.status(404);
      throw new Error('Technician not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete technician (soft delete)
// @route   DELETE /api/technicians/:id
// @access  Public
const deleteTechnician = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id);

    if (technician) {
      technician.status = 'Inactive';
      await technician.save();
      
      // Optional: Unassign from future jobs?
      // For now, we just mark inactive.
      
      res.json({ message: 'Technician marked as Inactive' });
    } else {
      res.status(404);
      throw new Error('Technician not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician
};
