const Asset = require('../models/Asset');
const { createLog } = require('./activityLogController');

// @desc    Get all assets
// @route   GET /api/assets
// @access  Public
const getAssets = async (req, res, next) => {
  try {
    const { locationId, criticality, status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (locationId) query.location = locationId;
    if (criticality) query.criticality = criticality;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { assetTag: { $regex: search, $options: 'i' } }
      ];
    }

    const count = await Asset.countDocuments(query);
    const assets = await Asset.find(query)
      .populate('location', 'name code')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({
      assets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalAssets: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Public
const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('location');
    if (asset) {
      res.json(asset);
    } else {
      res.status(404);
      throw new Error('Asset not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create asset
// @route   POST /api/assets
// @access  Public
const createAsset = async (req, res, next) => {
  try {
    const { name, assetTag, type, location, criticality, status, lastMaintenanceDate, nextMaintenanceDue } = req.body;

    const assetExists = await Asset.findOne({ assetTag });
    if (assetExists) {
      res.status(400);
      throw new Error('Asset tag already exists');
    }

    const asset = await Asset.create({
      name,
      assetTag,
      type,
      location,
      criticality,
      status,
      lastMaintenanceDate,
      nextMaintenanceDue
    });

    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Public
const updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (asset) {
      asset.name = req.body.name || asset.name;
      asset.assetTag = req.body.assetTag || asset.assetTag;
      asset.type = req.body.type || asset.type;
      asset.location = req.body.location || asset.location;
      asset.criticality = req.body.criticality || asset.criticality;
      asset.status = req.body.status || asset.status;
      asset.lastMaintenanceDate = req.body.lastMaintenanceDate || asset.lastMaintenanceDate;
      asset.nextMaintenanceDue = req.body.nextMaintenanceDue || asset.nextMaintenanceDue;

      // Log status change
      if (req.body.status && req.body.status !== asset.status) {
        await createLog({
          type: 'ASSET_STATUS_CHANGED',
          message: `Asset "${asset.name}" status changed to ${req.body.status}`,
          entityType: 'Asset',
          entityId: asset._id,
          metadata: { oldStatus: asset.status, newStatus: req.body.status }
        });
      }

      const updatedAsset = await asset.save();
      res.json(updatedAsset);
    } else {
      res.status(404);
      throw new Error('Asset not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Public
const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (asset) {
      await Asset.deleteOne({ _id: asset._id });
      res.json({ message: 'Asset removed' });
    } else {
      res.status(404);
      throw new Error('Asset not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
};
