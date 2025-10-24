// src/routes/commentaires.routes.js
import express from 'express';
import CommentaireController from '../controllers/CommentaireController.js';
import { authenticateToken, requireEditeur, requireGestionnaire } from '../middlewares/auth.middleware.js';
import { validateId } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Récupérer les commentaires en attente de validation (éditeurs+)
router.get('/pending', authenticateToken, requireEditeur, CommentaireController.getPendingCommentaires);

// Valider un commentaire (éditeurs+)
router.put('/:id/validate', authenticateToken, requireEditeur, validateId, CommentaireController.validateCommentaire);

// Rejeter un commentaire (éditeurs+)
router.put('/:id/reject', authenticateToken, requireEditeur, validateId, CommentaireController.rejectCommentaire);

// Supprimer un commentaire (gestionnaires+)
router.delete('/:id', authenticateToken, requireGestionnaire, validateId, CommentaireController.deleteCommentaire);

export default router;
