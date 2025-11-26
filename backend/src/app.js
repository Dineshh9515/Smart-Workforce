const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const configurePassport = require('./config/passport');

const notFoundMiddleware = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const assetRoutes = require('./routes/assetRoutes');
const jobRoutes = require('./routes/jobRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const locationRoutes = require('./routes/locationRoutes');
const assetDowntimeRoutes = require('./routes/assetDowntimeRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');

const app = express();

// Passport Config
configurePassport(passport);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS Config
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Session Config
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/asset-downtime', assetDowntimeRoutes);
app.use('/api/activity-logs', activityLogRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
