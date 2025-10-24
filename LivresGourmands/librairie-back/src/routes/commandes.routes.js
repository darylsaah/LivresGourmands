// src/routes/commandes.routes.js
import express from 'express';
import CommandeController from '../controllers/CommandeController.js';
import { authenticateToken, requireGestionnaire } from '../middlewares/auth.middleware.js';
import { validateCommande, validateId, validateSearchFilters } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Créer une commande (client authentifié)
router.post('/', authenticateToken, validateCommande, CommandeController.createCommande);

// Récupérer les commandes du client connecté
router.get('/my', authenticateToken, CommandeController.getMyCommandes);

// Récupérer une commande spécifique
router.get('/:id', authenticateToken, validateId, CommandeController.getCommandeById);

// Récupérer toutes les commandes (gestionnaires/admin)
router.get('/', authenticateToken, requireGestionnaire, validateSearchFilters, CommandeController.getAllCommandes);

// Mettre à jour le statut d'une commande (gestionnaires/admin)
router.put('/:id/status', authenticateToken, requireGestionnaire, validateId, CommandeController.updateCommandeStatus);

// Annuler une commande
router.put('/:id/cancel', authenticateToken, validateId, CommandeController.cancelCommande);

export default router;
