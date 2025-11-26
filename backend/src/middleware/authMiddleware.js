const requireAuth = (req, res, next) => {
  if (req.isAuthenticated() || req.user) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    next();
  };
};

module.exports = { requireAuth, requireRole };
