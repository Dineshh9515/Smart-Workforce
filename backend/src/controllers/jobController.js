const Job = require('../models/Job');
const Technician = require('../models/Technician');
const AvailabilitySlot = require('../models/AvailabilitySlot');
const { createLog } = require('./activityLogController');

// Helper to calculate dueAt and isOverdue
const calculateJobFields = (data) => {
  const updates = { ...data };
  
  // Calculate dueAt if slaHours is provided
  if (updates.slaHours && (updates.plannedDate || updates.scheduledStart)) {
    const startDate = updates.scheduledStart || updates.plannedDate;
    const dueAt = new Date(new Date(startDate).getTime() + updates.slaHours * 60 * 60 * 1000);
    updates.dueAt = dueAt;
  }

  // Calculate isOverdue
  if (updates.dueAt && updates.status !== 'Completed' && updates.status !== 'Cancelled') {
    updates.isOverdue = new Date() > new Date(updates.dueAt);
  } else if (updates.status === 'Completed' || updates.status === 'Cancelled') {
    updates.isOverdue = false;
  }

  return updates;
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const { status, priority, locationId, technicianId, assetId, startDate, endDate, search, isOverdue, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (locationId) query.location = locationId;
    if (technicianId) query.technician = technicianId;
    if (assetId) query.asset = assetId;
    if (isOverdue === 'true') query.isOverdue = true;
    
    if (startDate || endDate) {
      query.plannedDate = {};
      if (startDate) query.plannedDate.$gte = new Date(startDate);
      if (endDate) query.plannedDate.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const count = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('location', 'name')
      .populate('asset', 'name assetTag')
      .populate('technician', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ plannedDate: 1, createdAt: -1 });

    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalJobs: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('location')
      .populate('asset')
      .populate('technician');
      
    if (job) {
      res.json(job);
    } else {
      res.status(404);
      throw new Error('Job not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Public
const createJob = async (req, res, next) => {
  try {
    let jobData = req.body;
    
    // Calculate SLA fields
    jobData = calculateJobFields(jobData);

    const job = await Job.create(jobData);

    // Log activity
    await createLog({
      type: 'JOB_CREATED',
      message: `Job "${job.title}" created`,
      entityType: 'Job',
      entityId: job._id,
      metadata: { priority: job.priority, status: job.status }
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Public
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (job) {
      const oldStatus = job.status;
      
      // Merge existing data with updates to recalculate fields correctly
      const mergedData = { 
        ...job.toObject(), 
        ...req.body,
        // Ensure dates are Date objects for calculation
        plannedDate: req.body.plannedDate ? new Date(req.body.plannedDate) : job.plannedDate,
        scheduledStart: req.body.scheduledStart ? new Date(req.body.scheduledStart) : job.scheduledStart
      };
      
      const calculatedFields = calculateJobFields(mergedData);

      // Apply updates
      Object.keys(req.body).forEach(key => {
        job[key] = req.body[key];
      });
      
      // Apply calculated fields
      if (calculatedFields.dueAt) job.dueAt = calculatedFields.dueAt;
      if (calculatedFields.isOverdue !== undefined) job.isOverdue = calculatedFields.isOverdue;

      const updatedJob = await job.save();

      // Log activity
      if (req.body.status && req.body.status !== oldStatus) {
        await createLog({
          type: 'JOB_STATUS_CHANGED',
          message: `Job "${job.title}" status changed from ${oldStatus} to ${job.status}`,
          entityType: 'Job',
          entityId: job._id,
          metadata: { oldStatus, newStatus: job.status }
        });
      } else {
        await createLog({
          type: 'JOB_UPDATED',
          message: `Job "${job.title}" updated`,
          entityType: 'Job',
          entityId: job._id
        });
      }

      res.json(updatedJob);
    } else {
      res.status(404);
      throw new Error('Job not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Assign technician/asset to job
// @route   PATCH /api/jobs/:id/assign
// @access  Public
const assignJob = async (req, res, next) => {
  try {
    const { technicianId, assetId } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (technicianId) {
      // Optional: Check availability
      if (job.plannedDate) {
        const availability = await AvailabilitySlot.findOne({
          technician: technicianId,
          date: job.plannedDate
        });
        
        // If we want to enforce availability check:
        // if (!availability || !availability.isAvailable) {
        //   res.status(400);
        //   throw new Error('Technician is not available on the planned date');
        // }
      }
      
      job.technician = technicianId;
      job.status = 'Assigned';
    }

    if (assetId) {
      job.asset = assetId;
    }

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel job
// @route   DELETE /api/jobs/:id
// @access  Public
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      job.status = 'Cancelled';
      await job.save();
      res.json({ message: 'Job cancelled' });
    } else {
      res.status(404);
      throw new Error('Job not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get job summary stats
// @route   GET /api/jobs/summary
// @access  Public
const getJobSummary = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments();
    
    const countsByStatus = await Job.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Format countsByStatus as an object
    const statusCounts = {};
    countsByStatus.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    // Update overdue status for all active jobs before counting
    const now = new Date();
    await Job.updateMany(
      { 
        status: { $nin: ['Completed', 'Cancelled'] },
        dueAt: { $lt: now }
      },
      { $set: { isOverdue: true } }
    );

    const overdueJobsCount = await Job.countDocuments({ isOverdue: true });
    
    const overdueJobs = await Job.find({ isOverdue: true })
      .select('title priority location dueAt')
      .populate('location', 'name')
      .limit(10);

    // At risk: due in next 24 hours and not completed
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const atRiskJobs = await Job.find({
      status: { $nin: ['Completed', 'Cancelled'] },
      dueAt: { $gt: now, $lte: next24h }
    })
    .select('title priority location dueAt')
    .populate('location', 'name')
    .sort({ dueAt: 1 });

    res.json({
      totalJobs,
      countsByStatus: statusCounts,
      overdueJobsCount,
      overdueJobs,
      atRiskJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get technician workload summary
// @route   GET /api/jobs/workload-summary
// @access  Public
const getTechnicianWorkload = async (req, res, next) => {
  try {
    const { locationId, startDate, endDate } = req.query;
    
    const matchStage = {
      status: { $in: ['Planned', 'Assigned', 'In Progress'] },
      technician: { $exists: true, $ne: null }
    };

    if (locationId) {
      matchStage.location = new mongoose.Types.ObjectId(locationId);
    }

    if (startDate || endDate) {
      matchStage.plannedDate = {};
      if (startDate) matchStage.plannedDate.$gte = new Date(startDate);
      if (endDate) matchStage.plannedDate.$lte = new Date(endDate);
    }

    const workload = await Job.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$technician",
          totalActiveJobs: { $sum: 1 },
          jobsByStatus: {
            $push: "$status"
          }
        }
      },
      {
        $lookup: {
          from: "technicians",
          localField: "_id",
          foreignField: "_id",
          as: "technicianInfo"
        }
      },
      { $unwind: "$technicianInfo" },
      {
        $project: {
          technicianId: "$_id",
          technicianName: "$technicianInfo.name",
          location: "$technicianInfo.location", // We might need to populate this if we want location name
          totalActiveJobs: 1,
          jobsByStatus: 1
        }
      },
      { $sort: { totalActiveJobs: -1 } }
    ]);

    // Populate location names manually or via another lookup if needed, 
    // but for now let's just return what we have.
    // To make it cleaner, let's fetch all active technicians and merge with workload data
    // so we also see technicians with 0 jobs.
    
    const techQuery = { status: { $ne: 'Inactive' } };
    if (locationId) techQuery.location = locationId;
    
    const allTechnicians = await Technician.find(techQuery).populate('location', 'name');
    
    const result = allTechnicians.map(tech => {
      const work = workload.find(w => w.technicianId.toString() === tech._id.toString());
      return {
        technicianId: tech._id,
        technicianName: tech.name,
        locationName: tech.location?.name,
        totalActiveJobs: work ? work.totalActiveJobs : 0,
        jobsByStatus: work ? work.jobsByStatus.reduce((acc, status) => {
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {}) : {}
      };
    });

    // Sort by active jobs desc
    result.sort((a, b) => b.totalActiveJobs - a.totalActiveJobs);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  assignJob,
  deleteJob,
  getJobSummary,
  getTechnicianWorkload
};
