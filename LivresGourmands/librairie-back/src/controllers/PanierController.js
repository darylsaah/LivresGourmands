// src/controllers/PanierController.js
import PanierService from '../services/PanierService.js';

class PanierController {
  static async getPanier(req, res, next) {
    try {
      const { userId } = req.user;
      const panier = await PanierService.getPanier(userId);
      res.json(panier);
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req, res, next) {
    try {
      const { userId } = req.user;
      const { ouvrage_id, quantite = 1 } = req.body;
      await PanierService.addItem(userId, ouvrage_id, quantite);
      res.json({ message: 'Article ajouté au panier' });
    } catch (error) {
      next(error);
    }
  }

  static async updateItemQuantity(req, res, next) {
    try {
      const { userId } = req.user;
      const { ouvrage_id, quantite } = req.body;
      await PanierService.updateItemQuantity(userId, ouvrage_id, quantite);
      res.json({ message: 'Quantité mise à jour' });
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req, res, next) {
    try {
      const { userId } = req.user;
      const { ouvrage_id } = req.params;
      await PanierService.removeItem(userId, ouvrage_id);
      res.json({ message: 'Article retiré du panier' });
    } catch (error) {
      next(error);
    }
  }

  static async clearPanier(req, res, next) {
    try {
      const { userId } = req.user;
      await PanierService.clearPanier(userId);
      res.json({ message: 'Panier vidé' });
    } catch (error) {
      next(error);
    }
  }
}

export default PanierController;
