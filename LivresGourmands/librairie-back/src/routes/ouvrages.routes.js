// src/routes/ouvrages.routes.js
import express from 'express';
import OuvrageController from '../controllers/OuvrageController.js';
import { authenticateToken, requireEditeur, requireGestionnaire } from '../middlewares/auth.middleware.js';
import { validateOuvrage, validateAvis, validateCommentaire, validateSearchFilters, validateId } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Routes publiques
router.get('/', validateSearchFilters, OuvrageController.getAllOuvrages);
router.get('/:id', validateId, OuvrageController.getOuvrageById);

// Routes protégées pour les avis et commentaires
router.post('/:id/avis', authenticateToken, validateId, validateAvis, OuvrageController.addAvis);
router.post('/:id/commentaires', authenticateToken, validateId, validateCommentaire, OuvrageController.addCommentaire);

// Routes protégées pour la gestion des ouvrages
router.post('/', authenticateToken, requireEditeur, validateOuvrage, OuvrageController.createOuvrage);
router.put('/:id', authenticateToken, requireEditeur, validateId, validateOuvrage, OuvrageController.updateOuvrage);
router.delete('/:id', authenticateToken, requireGestionnaire, validateId, OuvrageController.deleteOuvrage);

// Route pour la gestion du stock
router.put('/:id/stock', authenticateToken, requireGestionnaire, validateId, OuvrageController.updateStock);

export default router;
