// src/routes/categories.routes.js
import express from 'express';
import Category from '../models/Category.js';
import { authenticateToken, requireEditeur } from '../middlewares/auth.middleware.js';
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

// Validation pour les catégories
const validateCategory = [
  body('nom').trim().isLength({ min: 1, max: 100 }).withMessage('Le nom est requis (max 100 caractères)'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description trop longue'),
  handleValidationErrors
];

// Routes publiques
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// Routes protégées (éditeurs+)
router.post('/', authenticateToken, requireEditeur, validateCategory, async (req, res, next) => {
  try {
    const categoryId = await Category.create(req.body);
    res.status(201).json({ 
      message: 'Catégorie créée avec succès', 
      categoryId 
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, requireEditeur, validateId, validateCategory, async (req, res, next) => {
  try {
    const success = await Category.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    res.json({ message: 'Catégorie mise à jour avec succès' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, requireEditeur, validateId, async (req, res, next) => {
  try {
    const success = await Category.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
