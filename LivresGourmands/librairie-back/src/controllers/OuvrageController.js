// src/controllers/OuvrageController.js
import OuvrageService from '../services/OuvrageService.js';

class OuvrageController {
  static async getAllOuvrages(req, res, next) {
    try {
      const filters = {
        categorie_id: req.query.categorie_id,
        search: req.query.search
      };
      
      const ouvrages = await OuvrageService.getAllOuvrages(filters);
      res.json(ouvrages);
    } catch (error) {
      next(error);
    }
  }

  static async getOuvrageById(req, res, next) {
    try {
      const { id } = req.params;
      const ouvrage = await OuvrageService.getOuvrageById(id);
      res.json(ouvrage);
    } catch (error) {
      next(error);
    }
  }

  static async createOuvrage(req, res, next) {
    try {
      const { role } = req.user;
      const ouvrageId = await OuvrageService.createOuvrage(req.body, role);
      res.status(201).json({ 
        message: 'Ouvrage créé avec succès', 
        ouvrageId 
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOuvrage(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.user;
      await OuvrageService.updateOuvrage(id, req.body, role);
      res.json({ message: 'Ouvrage mis à jour avec succès' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteOuvrage(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.user;
      await OuvrageService.deleteOuvrage(id, role);
      res.json({ message: 'Ouvrage supprimé avec succès' });
    } catch (error) {
      next(error);
    }
  }

  static async addAvis(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const avisId = await OuvrageService.addAvis(id, userId, req.body);
      res.status(201).json({ 
        message: 'Avis ajouté avec succès', 
        avisId 
      });
    } catch (error) {
      next(error);
    }
  }

  static async addCommentaire(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const commentaireId = await OuvrageService.addCommentaire(id, userId, req.body.contenu);
      res.status(201).json({ 
        message: 'Commentaire soumis avec succès', 
        commentaireId 
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const { role } = req.user;
      await OuvrageService.updateStock(id, stock, role);
      res.json({ message: 'Stock mis à jour avec succès' });
    } catch (error) {
      next(error);
    }
  }
}

export default OuvrageController;
