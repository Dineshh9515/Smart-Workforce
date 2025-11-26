const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Location = require('../models/Location');
const Technician = require('../models/Technician');
const Asset = require('../models/Asset');
const Job = require('../models/Job');
const AvailabilitySlot = require('../models/AvailabilitySlot');
const logger = require('../utils/logger');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Job.deleteMany();
    await AvailabilitySlot.deleteMany();
    await Asset.deleteMany();
    await Technician.deleteMany();
    await Location.deleteMany();

    const locations = await Location.insertMany([
      { name: 'Plant A - North', code: 'PLANT-A', address: '123 Industrial Way', city: 'Houston', country: 'USA' },
      { name: 'Plant B - South', code: 'PLANT-B', address: '456 Energy Blvd', city: 'Dallas', country: 'USA' },
      { name: 'Offshore Platform X', code: 'PLAT-X', address: 'Gulf of Mexico', city: 'N/A', country: 'USA' }
    ]);

    const technicians = await Technician.insertMany([
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Field Technician',
        primarySkill: 'Electrical',
        skills: ['Electrical', 'Instrumentation'],
        location: locations[0]._id,
        status: 'Available',
        shiftType: 'Day'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Supervisor',
        primarySkill: 'Mechanical',
        skills: ['Mechanical', 'Hydraulics'],
        location: locations[0]._id,
        status: 'On Job',
        shiftType: 'Day'
      },
      {
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        role: 'Field Technician',
        primarySkill: 'Instrumentation',
        skills: ['Instrumentation', 'PLC'],
        location: locations[1]._id,
        status: 'Available',
        shiftType: 'Night'
      },
      {
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        role: 'Engineer',
        primarySkill: 'Process',
        skills: ['Process', 'Safety'],
        location: locations[2]._id,
        status: 'On Leave',
        shiftType: 'Rotational'
      }
    ]);

    const assets = await Asset.insertMany([
      {
        name: 'Main Compressor A',
        assetTag: 'COMP-001',
        type: 'Compressor',
        location: locations[0]._id,
        criticality: 'High',
        status: 'Operational'
      },
      {
        name: 'Feed Pump B',
        assetTag: 'PUMP-002',
        type: 'Pump',
        location: locations[0]._id,
        criticality: 'Medium',
        status: 'Under Maintenance'
      },
      {
        name: 'Generator Unit 1',
        assetTag: 'GEN-001',
        type: 'Generator',
        location: locations[1]._id,
        criticality: 'High',
        status: 'Down'
      },
      {
        name: 'Conveyor Belt System',
        assetTag: 'CONV-101',
        type: 'Conveyor',
        location: locations[1]._id,
        criticality: 'Low',
        status: 'Operational'
      }
    ]);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await AvailabilitySlot.insertMany([
      {
        technician: technicians[0]._id,
        date: today,
        shift: 'Full Day',
        isAvailable: true
      },
      {
        technician: technicians[0]._id,
        date: tomorrow,
        shift: 'Full Day',
        isAvailable: true
      },
      {
        technician: technicians[2]._id,
        date: today,
        shift: 'Night',
        isAvailable: true
      },
      {
        technician: technicians[3]._id,
        date: today,
        shift: 'Full Day',
        isAvailable: false,
        reason: 'On Leave'
      }
    ]);

    await Job.insertMany([
      {
        title: 'Routine Inspection of Compressor',
        description: 'Check oil levels, vibration, and temperature.',
        priority: 'Medium',
        status: 'Planned',
        location: locations[0]._id,
        asset: assets[0]._id,
        plannedDate: tomorrow
      },
      {
        title: 'Emergency Repair on Generator',
        description: 'Generator failed to start. Investigate immediately.',
        priority: 'Critical',
        status: 'In Progress',
        location: locations[1]._id,
        asset: assets[2]._id,
        technician: technicians[2]._id,
        plannedDate: today,
        actualStart: today
      },
      {
        title: 'Pump Maintenance',
        description: 'Replace seals and bearings.',
        priority: 'High',
        status: 'Assigned',
        location: locations[0]._id,
        asset: assets[1]._id,
        technician: technicians[1]._id,
        plannedDate: today
      }
    ]);

    logger.info('Data Imported!');
    process.exit();
  } catch (error) {
    logger.error(`${error}`);
    process.exit(1);
  }
};

importData();
