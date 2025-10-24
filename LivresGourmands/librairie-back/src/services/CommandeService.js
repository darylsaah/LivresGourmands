// src/services/CommandeService.js
import db from '../config/db.js';
import Commande from '../models/Commande.js';
import PanierService from './PanierService.js';
import OuvrageService from './OuvrageService.js';

class CommandeService {
  static async createCommande(clientId, commandeData) {
    const { adresse_livraison, mode_livraison, mode_paiement } = commandeData;

    // Valider le panier
    const { panier, items } = await PanierService.validatePanier(clientId);

    // Calculer le total
    const total = items.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0);

    // Démarrer une transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Créer la commande
      const commandeId = await Commande.create({
        client_id: clientId,
        total,
        adresse_livraison,
        mode_livraison,
        mode_paiement,
        payment_provider_id: null // À implémenter avec un vrai provider
      });

      // Ajouter les items à la commande et décrémenter le stock
      for (const item of items) {
        await Commande.addItem(commandeId, item.ouvrage_id, item.quantite, item.prix_unitaire);
        await OuvrageService.decrementStock(item.ouvrage_id, item.quantite);
      }

      // Vider le panier
      await PanierService.clearPanier(clientId);

      await connection.commit();

      return {
        commandeId,
        total,
        message: 'Commande créée avec succès'
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getCommandesByClient(clientId) {
    return await Commande.findByClient(clientId);
  }

  static async getCommandeById(id, userId, userRole) {
    const commande = await Commande.findById(id);
    if (!commande) {
      throw new Error('Commande non trouvée');
    }

    // Vérifier les permissions
    if (commande.client_id !== userId && !['gestionnaire', 'administrateur'].includes(userRole)) {
      throw new Error('Permissions insuffisantes');
    }

    return await Commande.getCommandeComplete(id);
  }

  static async getAllCommandes(filters = {}, userRole) {
    if (!['gestionnaire', 'administrateur'].includes(userRole)) {
      throw new Error('Permissions insuffisantes');
    }

    return await Commande.findAll(filters);
  }

  static async updateCommandeStatus(id, statut, userRole) {
    if (!['gestionnaire', 'administrateur'].includes(userRole)) {
      throw new Error('Permissions insuffisantes');
    }

    const commande = await Commande.findById(id);
    if (!commande) {
      throw new Error('Commande non trouvée');
    }

    return await Commande.updateStatus(id, statut);
  }

  static async cancelCommande(id, userId, userRole) {
    const commande = await Commande.findById(id);
    if (!commande) {
      throw new Error('Commande non trouvée');
    }

    // Vérifier les permissions
    if (commande.client_id !== userId && !['gestionnaire', 'administrateur'].includes(userRole)) {
      throw new Error('Permissions insuffisantes');
    }

    // Seules les commandes en cours peuvent être annulées
    if (commande.statut !== 'en_cours') {
      throw new Error('Seules les commandes en cours peuvent être annulées');
    }

    // Si la commande est annulée, remettre le stock
    const items = await Commande.getItems(id);
    for (const item of items) {
      await OuvrageService.updateStock(item.ouvrage_id, item.quantite, userRole);
    }

    return await Commande.updateStatus(id, 'annulee');
  }
}

export default CommandeService;
