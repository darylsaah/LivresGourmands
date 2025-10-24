// src/controllers/ListeCadeauxController.js
import ListeCadeaux from '../models/ListeCadeaux.js';

class ListeCadeauxController {
  static async createListe(req, res, next) {
    try {
      const { userId } = req.user;
      const { nom } = req.body;
      const result = await ListeCadeaux.create({ nom, proprietaire_id: userId });
      res.status(201).json({
        message: 'Liste de cadeaux créée',
        listeId: result.id,
        code_partage: result.code_partage
      });
    } catch (error) {
      next(error);
    }
  }

  static async getListeByCode(req, res, next) {
    try {
      const { code } = req.params;
      const liste = await ListeCadeaux.getListeComplete(code);
      if (!liste) {
        return res.status(404).json({ error: 'Liste non trouvée' });
      }
      res.json(liste);
    } catch (error) {
      next(error);
    }
  }

  static async getMyListes(req, res, next) {
    try {
      const { userId } = req.user;
      const listes = await ListeCadeaux.findByProprietaire(userId);
      res.json(listes);
    } catch (error) {
      next(error);
    }
  }

  static async addItemToListe(req, res, next) {
    try {
      const { id } = req.params;
      const { ouvrage_id, quantite_souhaitee = 1 } = req.body;
      const { userId } = req.user;

      // Vérifier que l'utilisateur est propriétaire de la liste
      const liste = await ListeCadeaux.findById(id);
      if (!liste || liste.proprietaire_id !== userId) {
        return res.status(403).json({ error: 'Permissions insuffisantes' });
      }

      await ListeCadeaux.addItem(id, ouvrage_id, quantite_souhaitee);
      res.json({ message: 'Article ajouté à la liste' });
    } catch (error) {
      next(error);
    }
  }

  static async removeItemFromListe(req, res, next) {
    try {
      const { id, ouvrage_id } = req.params;
      const { userId } = req.user;

      // Vérifier que l'utilisateur est propriétaire de la liste
      const liste = await ListeCadeaux.findById(id);
      if (!liste || liste.proprietaire_id !== userId) {
        return res.status(403).json({ error: 'Permissions insuffisantes' });
      }

      await ListeCadeaux.removeItem(id, ouvrage_id);
      res.json({ message: 'Article retiré de la liste' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteListe(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      // Vérifier que l'utilisateur est propriétaire de la liste
      const liste = await ListeCadeaux.findById(id);
      if (!liste || liste.proprietaire_id !== userId) {
        return res.status(403).json({ error: 'Permissions insuffisantes' });
      }

      await ListeCadeaux.delete(id);
      res.json({ message: 'Liste supprimée' });
    } catch (error) {
      next(error);
    }
  }
}

export default ListeCadeauxController;
