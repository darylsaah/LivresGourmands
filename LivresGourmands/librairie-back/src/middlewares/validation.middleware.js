// src/middlewares/validation.middleware.js
import { body, param, query, validationResult } from 'express-validator';

// Middleware pour traiter les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors.array()
    });
  }
  next();
};

// Validations pour l'authentification
export const validateRegister = [
  body('nom').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role').optional().isIn(['client', 'editeur', 'gestionnaire', 'administrateur']).withMessage('Rôle invalide'),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
  handleValidationErrors
];

// Validations pour les ouvrages
export const validateOuvrage = [
  body('titre').trim().isLength({ min: 1, max: 255 }).withMessage('Le titre est requis (max 255 caractères)'),
  body('auteur').trim().isLength({ min: 1, max: 150 }).withMessage('L\'auteur est requis (max 150 caractères)'),
  body('isbn').optional().isLength({ min: 10, max: 20 }).withMessage('ISBN invalide'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description trop longue'),
  body('prix').isFloat({ min: 0.01 }).withMessage('Le prix doit être positif'),
  body('stock').isInt({ min: 0 }).withMessage('Le stock ne peut pas être négatif'),
  body('categorie_id').optional().isInt({ min: 1 }).withMessage('ID de catégorie invalide'),
  handleValidationErrors
];

// Validations pour les avis
export const validateAvis = [
  body('note').isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
  body('commentaire').optional().isLength({ max: 500 }).withMessage('Commentaire trop long'),
  handleValidationErrors
];

// Validations pour les commentaires
export const validateCommentaire = [
  body('contenu').trim().isLength({ min: 10, max: 1000 }).withMessage('Le commentaire doit contenir entre 10 et 1000 caractères'),
  handleValidationErrors
];

// Validations pour le panier
export const validatePanierItem = [
  body('ouvrage_id').isInt({ min: 1 }).withMessage('ID d\'ouvrage invalide'),
  body('quantite').isInt({ min: 1 }).withMessage('La quantité doit être positive'),
  handleValidationErrors
];

// Validations pour les commandes
export const validateCommande = [
  body('adresse_livraison').trim().isLength({ min: 10, max: 500 }).withMessage('Adresse de livraison requise'),
  body('mode_livraison').trim().isLength({ min: 1, max: 100 }).withMessage('Mode de livraison requis'),
  body('mode_paiement').trim().isLength({ min: 1, max: 100 }).withMessage('Mode de paiement requis'),
  handleValidationErrors
];

// Validations pour les listes de cadeaux
export const validateListeCadeaux = [
  body('nom').trim().isLength({ min: 1, max: 150 }).withMessage('Le nom de la liste est requis'),
  handleValidationErrors
];

// Validations pour les paramètres d'URL
export const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  handleValidationErrors
];

export const validateCode = [
  param('code').isLength({ min: 32, max: 32 }).withMessage('Code de partage invalide'),
  handleValidationErrors
];

// Validations pour les filtres de recherche
export const validateSearchFilters = [
  query('categorie_id').optional().isInt({ min: 1 }).withMessage('ID de catégorie invalide'),
  query('search').optional().isLength({ max: 100 }).withMessage('Terme de recherche trop long'),
  query('statut').optional().isIn(['en_cours', 'payee', 'annulee', 'expediee']).withMessage('Statut invalide'),
  handleValidationErrors
];
