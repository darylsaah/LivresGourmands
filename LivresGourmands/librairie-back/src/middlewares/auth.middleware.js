// src/middlewares/auth.middleware.js
import AuthService from '../services/AuthService.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token d\'accès requis' });
    }

    const user = await AuthService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }

    next();
  };
};

export const requireClient = requireRole(['client']);
export const requireEditeur = requireRole(['editeur', 'gestionnaire', 'administrateur']);
export const requireGestionnaire = requireRole(['gestionnaire', 'administrateur']);
export const requireAdmin = requireRole(['administrateur']);
