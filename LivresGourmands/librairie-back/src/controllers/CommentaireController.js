// src/controllers/CommentaireController.js
import Commentaire from '../models/Commentaire.js';

class CommentaireController {
  static async getPendingCommentaires(req, res, next) {
    try {
      const { role } = req.user;
      if (!['editeur', 'gestionnaire', 'administrateur'].includes(role)) {
        return res.status(403).json({ error: 'Permissions insuffisantes' });
      }

      const commentaires = await Commentaire.findPending();
      res.json(commentaires);
    } catch (error) {
      next(error);
    }
  }

  static async validateCommentaire(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, role } = req.user;
      
      if (!['editeur', 'gestionnaire', 'administrateur'].includes(role)) {
        return res.status(403).json({ error: 'Permissions insuffisantes' });
      }

      await Commentaire.validate(id, userId);
      res.json({ message: 'Commentaire validé' });
    } catch (error) {
      next(error);
    }
  }

  static async rejectCommentaire(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, role } = req.user;
      
      if (!['editeur', 'gestionnaire', 'administrateur'].includes(role)) {
        return res.status(403).json({ error: 'Permissions insuffisantes' });
      }

      await Commentaire.reject(id, userId);
      res.json({ message: 'Commentaire rejeté' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCommentaire(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, role } = req.user;
      
      if (!['gestionnaire', 'administrateur'].includes(role)) {
        return res.status(403).json({ error: 'Permissions insuffisantes' });
      }

      await Commentaire.delete(id);
      res.json({ message: 'Commentaire supprimé' });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentaireController;
