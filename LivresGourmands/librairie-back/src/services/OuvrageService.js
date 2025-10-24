// src/services/OuvrageService.js
import Ouvrage from '../models/Ouvrage.js';
import Avis from '../models/Avis.js';
import Commentaire from '../models/Commentaire.js';
import User from '../models/User.js';

class OuvrageService {
  static async getAllOuvrages(filters = {}) {
    return await Ouvrage.findAll(filters);
  }

  static async getOuvrageById(id) {
    const ouvrage = await Ouvrage.findById(id);
    if (!ouvrage) {
      throw new Error('Ouvrage non trouvé');
    }

    // Récupérer les avis et statistiques
    const avisStats = await Avis.getStatsByOuvrage(id);
    const avis = await Avis.findByOuvrage(id);
    const commentairesValides = await Commentaire.findByOuvrage(id, true);

    return {
      ...ouvrage,
      avis: {
        stats: avisStats,
        liste: avis
      },
      commentaires: commentairesValides
    };
  }

  static async createOuvrage(ouvrageData, userRole) {
    // Vérifier les permissions
    if (!['editeur', 'gestionnaire', 'administrateur'].includes(userRole)) {
      throw new Error('Permissions insuffisantes');
    }

    // Validation des données
    if (ouvrageData.stock < 0) {
      throw new Error('Le stock ne peut pas être négatif');
    }

    if (ouvrageData.prix <= 0) {
      throw new Error('Le prix doit être positif');
    }

    return await Ouvrage.create(ouvrageData);
  }

  static async updateOuvrage(id, ouvrageData, userRole) {
    // Vérifier les permissions
    if (!['editeur', 'gestionnaire', 'administrateur'].includes(userRole)) {
      throw new Error('Permissions insuffisantes');
    }

    const ouvrage = await Ouvrage.findById(id);
    if (!ouvrage) {
      throw new Error('Ouvrage non trouvé');
    }

    // Validation des données
    if (ouvrageData.stock !== undefined && ouvrageData.stock < 0) {
      throw new Error('Le stock ne peut pas être négatif');
    }

    if (ouvrageData.prix !== undefined && ouvrageData.prix <= 0) {
      throw new Error('Le prix doit être positif');
    }

    return await Ouvrage.update(id, ouvrageData);
  }

  static async deleteOuvrage(id, userRole) {
    // Vérifier les permissions
    if (!['gestionnaire', 'administrateur'].includes(userRole)) {
      throw new Error('Permissions insuffisantes');
    }

    const ouvrage = await Ouvrage.findById(id);
    if (!ouvrage) {
      throw new Error('Ouvrage non trouvé');
    }

    return await Ouvrage.delete(id);
  }

  static async addAvis(ouvrageId, userId, avisData) {
    // Vérifier que l'utilisateur a acheté cet ouvrage
    const hasPurchased = await User.hasPurchasedBook(userId, ouvrageId);
    if (!hasPurchased) {
      throw new Error('Vous devez avoir acheté cet ouvrage pour laisser un avis');
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingAvis = await Avis.findByClientAndOuvrage(userId, ouvrageId);
    if (existingAvis) {
      throw new Error('Vous avez déjà laissé un avis pour cet ouvrage');
    }

    return await Avis.create({
      client_id: userId,
      ouvrage_id: ouvrageId,
      ...avisData
    });
  }

  static async addCommentaire(ouvrageId, userId, contenu) {
    return await Commentaire.create({
      client_id: userId,
      ouvrage_id: ouvrageId,
      contenu
    });
  }

  static async updateStock(id, newStock, userRole) {
    // Vérifier les permissions
    if (!['gestionnaire', 'administrateur'].includes(userRole)) {
      throw new Error('Permissions insuffisantes');
    }

    if (newStock < 0) {
      throw new Error('Le stock ne peut pas être négatif');
    }

    return await Ouvrage.updateStock(id, newStock);
  }

  static async decrementStock(id, quantity) {
    const success = await Ouvrage.decrementStock(id, quantity);
    if (!success) {
      throw new Error('Stock insuffisant ou ouvrage non trouvé');
    }
    return success;
  }
}

export default OuvrageService;
