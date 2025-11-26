const express = require('express');
const passport = require('passport');
const router = express.Router();
const { signup, login, logout, getMe } = require('../controllers/authController');

// Local Auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

// GitHub Auth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  }
);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  }
);

module.exports = router;
