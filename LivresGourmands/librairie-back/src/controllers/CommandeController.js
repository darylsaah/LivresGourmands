// src/controllers/CommandeController.js
import CommandeService from '../services/CommandeService.js';

class CommandeController {
  static async createCommande(req, res, next) {
    try {
      const { userId } = req.user;
      const result = await CommandeService.createCommande(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMyCommandes(req, res, next) {
    try {
      const { userId } = req.user;
      const commandes = await CommandeService.getCommandesByClient(userId);
      res.json(commandes);
    } catch (error) {
      next(error);
    }
  }

  static async getCommandeById(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, role } = req.user;
      const commande = await CommandeService.getCommandeById(id, userId, role);
      res.json(commande);
    } catch (error) {
      next(error);
    }
  }

  static async getAllCommandes(req, res, next) {
    try {
      const { role } = req.user;
      const filters = {
        statut: req.query.statut
      };
      const commandes = await CommandeService.getAllCommandes(filters, role);
      res.json(commandes);
    } catch (error) {
      next(error);
    }
  }

  static async updateCommandeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      const { role } = req.user;
      await CommandeService.updateCommandeStatus(id, statut, role);
      res.json({ message: 'Statut de la commande mis à jour' });
    } catch (error) {
      next(error);
    }
  }

  static async cancelCommande(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, role } = req.user;
      await CommandeService.cancelCommande(id, userId, role);
      res.json({ message: 'Commande annulée' });
    } catch (error) {
      next(error);
    }
  }
}

export default CommandeController;
