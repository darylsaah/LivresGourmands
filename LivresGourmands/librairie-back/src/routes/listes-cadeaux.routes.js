// src/routes/listes-cadeaux.routes.js
import express from 'express';
import ListeCadeauxController from '../controllers/ListeCadeauxController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateListeCadeaux, validatePanierItem, validateCode, validateId } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Créer une liste de cadeaux (client authentifié)
router.post('/', authenticateToken, validateListeCadeaux, ListeCadeauxController.createListe);

// Récupérer les listes du client connecté
router.get('/my', authenticateToken, ListeCadeauxController.getMyListes);

// Consulter une liste par code (public)
router.get('/:code', validateCode, ListeCadeauxController.getListeByCode);

// Ajouter un article à une liste (propriétaire)
router.post('/:id/items', authenticateToken, validateId, validatePanierItem, ListeCadeauxController.addItemToListe);

// Retirer un article d'une liste (propriétaire)
router.delete('/:id/items/:ouvrage_id', authenticateToken, validateId, ListeCadeauxController.removeItemFromListe);

// Supprimer une liste (propriétaire)
router.delete('/:id', authenticateToken, validateId, ListeCadeauxController.deleteListe);

export default router;
