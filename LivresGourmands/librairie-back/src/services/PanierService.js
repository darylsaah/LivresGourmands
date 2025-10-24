// src/services/PanierService.js
import Panier from '../models/Panier.js';
import Ouvrage from '../models/Ouvrage.js';

class PanierService {
  static async getPanier(clientId) {
    const panier = await Panier.findOrCreateByClient(clientId);
    const items = await Panier.getItems(panier.id);
    const total = await Panier.calculateTotal(panier.id);

    return {
      id: panier.id,
      items,
      total
    };
  }

  static async addItem(clientId, ouvrageId, quantite = 1) {
    // Vérifier que l'ouvrage existe et a du stock
    const ouvrage = await Ouvrage.findById(ouvrageId);
    if (!ouvrage) {
      throw new Error('Ouvrage non trouvé');
    }

    if (ouvrage.stock < quantite) {
      throw new Error('Stock insuffisant');
    }

    // Récupérer ou créer le panier
    const panier = await Panier.findOrCreateByClient(clientId);

    // Ajouter l'item au panier
    return await Panier.addItem(panier.id, ouvrageId, quantite, ouvrage.prix);
  }

  static async updateItemQuantity(clientId, ouvrageId, quantite) {
    const panier = await Panier.findOrCreateByClient(clientId);
    
    if (quantite <= 0) {
      return await Panier.removeItem(panier.id, ouvrageId);
    }

    // Vérifier le stock disponible
    const ouvrage = await Ouvrage.findById(ouvrageId);
    if (!ouvrage) {
      throw new Error('Ouvrage non trouvé');
    }

    if (ouvrage.stock < quantite) {
      throw new Error('Stock insuffisant');
    }

    return await Panier.updateItemQuantity(panier.id, ouvrageId, quantite);
  }

  static async removeItem(clientId, ouvrageId) {
    const panier = await Panier.findOrCreateByClient(clientId);
    return await Panier.removeItem(panier.id, ouvrageId);
  }

  static async clearPanier(clientId) {
    const panier = await Panier.findOrCreateByClient(clientId);
    return await Panier.clear(panier.id);
  }

  static async validatePanier(clientId) {
    const panier = await Panier.findOrCreateByClient(clientId);
    const items = await Panier.getItems(panier.id);

    if (items.length === 0) {
      throw new Error('Le panier est vide');
    }

    // Vérifier que tous les ouvrages sont encore disponibles
    for (const item of items) {
      const ouvrage = await Ouvrage.findById(item.ouvrage_id);
      if (!ouvrage || ouvrage.stock < item.quantite) {
        throw new Error(`Stock insuffisant pour "${item.titre}"`);
      }
    }

    return { panier, items };
  }
}

export default PanierService;
