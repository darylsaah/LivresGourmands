// src/routes/panier.routes.js
import express from 'express';
import PanierController from '../controllers/PanierController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validatePanierItem, validateId } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Toutes les routes du panier nécessitent une authentification
router.use(authenticateToken);

// Récupérer le panier
router.get('/', PanierController.getPanier);

// Ajouter un article au panier
router.post('/items', validatePanierItem, PanierController.addItem);

// Modifier la quantité d'un article
router.put('/items', validatePanierItem, PanierController.updateItemQuantity);

// Retirer un article du panier
router.delete('/items/:ouvrage_id', validateId, PanierController.removeItem);

// Vider le panier
router.delete('/', PanierController.clearPanier);

export default router;
