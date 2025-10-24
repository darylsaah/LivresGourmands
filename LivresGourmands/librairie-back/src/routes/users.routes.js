// src/routes/users.routes.js
import express from 'express';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';
import { validateId } from '../middlewares/validation.middleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware pour traiter les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors.array()
    });
  }
  next();
};

// Validation pour les utilisateurs
const validateUserUpdate = [
  body('nom').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email invalide'),
  body('role').optional().isIn(['client', 'editeur', 'gestionnaire', 'administrateur']).withMessage('Rôle invalide'),
  body('actif').optional().isBoolean().withMessage('Actif doit être un booléen'),
  handleValidationErrors
];

// Récupérer tous les utilisateurs (admin seulement)
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Récupérer un utilisateur spécifique (admin ou propriétaire)
router.get('/:id', authenticateToken, validateId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    // Vérifier les permissions
    if (id !== userId.toString() && role !== 'administrateur') {
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Mettre à jour un utilisateur (admin ou propriétaire)
router.put('/:id', authenticateToken, validateId, validateUserUpdate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    // Vérifier les permissions
    if (id !== userId.toString() && role !== 'administrateur') {
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }

    // Les clients ne peuvent pas changer leur rôle
    if (role === 'client' && req.body.role) {
      delete req.body.role;
    }

    const success = await User.update(id, req.body);
    if (!success) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    next(error);
  }
});

// Supprimer un utilisateur (admin seulement)
router.delete('/:id', authenticateToken, requireAdmin, validateId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Empêcher l'auto-suppression
    if (id === userId.toString()) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous supprimer vous-même' });
    }

    const success = await User.delete(id);
    if (!success) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
