const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc    Register a new user (Local)
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'PLANNER',
      provider: 'local'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Local)
// @route   POST /api/auth/login
// @access  Public
const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message || 'Login failed' });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    });
  })(req, res, next);
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe
};
