const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

const configurePassport = (passport) => {
  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Local Strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      
      if (user.provider !== 'local') {
        return done(null, false, { message: `Please login with ${user.provider}` });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // GitHub Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ provider: 'github', providerId: profile.id });
        
        if (!user) {
          // Check if email exists
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              // Link account or return error? For simplicity, return error or just log them in if we trust email
              // Here we'll just return the existing user if they logged in via email before, 
              // but ideally we should update provider or handle merging.
              // For this exercise, let's create a new user if not found by providerId, 
              // or fail if email is taken by local.
              if (existingUser.provider === 'local') {
                 return done(null, false, { message: 'Email already used by local account' });
              }
            }
          }

          user = await User.create({
            name: profile.displayName || profile.username,
            email: email || `${profile.username}@github.com`, // Fallback
            provider: 'github',
            providerId: profile.id,
            role: 'PLANNER' // Default role
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }));
  }

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ provider: 'google', providerId: profile.id });
        
        if (!user) {
          const email = profile.emails[0].value;
          const existingUser = await User.findOne({ email });
          
          if (existingUser) {
             if (existingUser.provider === 'local') {
                 return done(null, false, { message: 'Email already used by local account' });
             }
             // If existing user is google but providerId didn't match (unlikely), just return it
             user = existingUser;
          } else {
            user = await User.create({
              name: profile.displayName,
              email: email,
              provider: 'google',
              providerId: profile.id,
              role: 'PLANNER'
            });
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }));
  }
};

module.exports = configurePassport;
