const AssetDowntime = require('../models/AssetDowntime');
const Asset = require('../models/Asset');
const { createLog } = require('./activityLogController');

// @desc    Get asset downtime history
// @route   GET /api/asset-downtime
// @access  Public
const getAssetDowntime = async (req, res, next) => {
  try {
    const { assetId, locationId, startDate, endDate } = req.query;
    const query = {};

    if (assetId) query.asset = assetId;
    
    if (startDate || endDate) {
      query.startedAt = {};
      if (startDate) query.startedAt.$gte = new Date(startDate);
      if (endDate) query.startedAt.$lte = new Date(endDate);
    }

    // If locationId is provided, we need to find assets in that location first
    if (locationId) {
      const assetsInLocation = await Asset.find({ location: locationId }).select('_id');
      const assetIds = assetsInLocation.map(a => a._id);
      
      if (query.asset) {
        // If assetId was also provided, ensure it's in the location
        if (!assetIds.some(id => id.toString() === query.asset)) {
          return res.json([]); // Asset not in location
        }
      } else {
        query.asset = { $in: assetIds };
      }
    }

    const downtimeRecords = await AssetDowntime.find(query)
      .populate('asset', 'name assetTag')
      .sort({ startedAt: -1 });

    res.json(downtimeRecords);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single downtime record
// @route   GET /api/asset-downtime/:id
// @access  Public
const getDowntimeById = async (req, res, next) => {
  try {
    const downtime = await AssetDowntime.findById(req.params.id).populate('asset');
    if (downtime) {
      res.json(downtime);
    } else {
      res.status(404);
      throw new Error('Downtime record not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create downtime record
// @route   POST /api/asset-downtime
// @access  Public
const createDowntime = async (req, res, next) => {
  try {
    const { asset, startedAt, endedAt, reason, updateAssetStatus } = req.body;

    const downtime = await AssetDowntime.create({
      asset,
      startedAt,
      endedAt,
      reason
    });

    // Optionally update asset status
    if (updateAssetStatus) {
      const assetDoc = await Asset.findById(asset);
      if (assetDoc) {
        const oldStatus = assetDoc.status;
        assetDoc.status = 'Down'; // Or 'Under Maintenance'
        await assetDoc.save();

        await createLog({
          type: 'ASSET_STATUS_CHANGED',
          message: `Asset "${assetDoc.name}" status changed to Down due to downtime report`,
          entityType: 'Asset',
          entityId: assetDoc._id,
          metadata: { oldStatus, newStatus: 'Down', reason }
        });
      }
    }

    res.status(201).json(downtime);
  } catch (error) {
    next(error);
  }
};

// @desc    Update downtime record
// @route   PUT /api/asset-downtime/:id
// @access  Public
const updateDowntime = async (req, res, next) => {
  try {
    const downtime = await AssetDowntime.findById(req.params.id);

    if (downtime) {
      downtime.startedAt = req.body.startedAt || downtime.startedAt;
      downtime.endedAt = req.body.endedAt || downtime.endedAt;
      downtime.reason = req.body.reason || downtime.reason;

      const updatedDowntime = await downtime.save();
      res.json(updatedDowntime);
    } else {
      res.status(404);
      throw new Error('Downtime record not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete downtime record
// @route   DELETE /api/asset-downtime/:id
// @access  Public
const deleteDowntime = async (req, res, next) => {
  try {
    const downtime = await AssetDowntime.findById(req.params.id);

    if (downtime) {
      await AssetDowntime.deleteOne({ _id: downtime._id });
      res.json({ message: 'Downtime record removed' });
    } else {
      res.status(404);
      throw new Error('Downtime record not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get downtime summary
// @route   GET /api/asset-downtime/summary
// @access  Public
const getDowntimeSummary = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const downtimeStats = await AssetDowntime.aggregate([
      {
        $match: {
          startedAt: { $gte: startDate }
        }
      },
      {
        $project: {
          asset: 1,
          durationHours: {
            $divide: [
              { $subtract: [{ $ifNull: ["$endedAt", new Date()] }, "$startedAt"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: "$asset",
          totalDowntimeHours: { $sum: "$durationHours" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "assets",
          localField: "_id",
          foreignField: "_id",
          as: "assetInfo"
        }
      },
      { $unwind: "$assetInfo" },
      {
        $project: {
          assetId: "$_id",
          assetName: "$assetInfo.name",
          criticality: "$assetInfo.criticality",
          totalDowntimeHours: 1,
          count: 1
        }
      },
      { $sort: { totalDowntimeHours: -1 } }
    ]);

    const totalDowntimeHours = downtimeStats.reduce((sum, item) => sum + item.totalDowntimeHours, 0);
    
    const topCriticalAssets = downtimeStats
      .filter(item => item.criticality === 'High')
      .slice(0, 5);

    res.json({
      totalDowntimeHours,
      downtimeByAsset: downtimeStats,
      topCriticalAssets
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssetDowntime,
  getDowntimeById,
  createDowntime,
  updateDowntime,
  deleteDowntime,
  getDowntimeSummary
};
