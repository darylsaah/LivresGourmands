// src/models/Commande.js
import db from '../config/db.js';

class Commande {
  static async create(commandeData) {
    const { client_id, total, adresse_livraison, mode_livraison, mode_paiement, payment_provider_id } = commandeData;
    const [result] = await db.query(
      'INSERT INTO commandes (client_id, total, adresse_livraison, mode_livraison, mode_paiement, payment_provider_id) VALUES (?, ?, ?, ?, ?, ?)',
      [client_id, total, adresse_livraison, mode_livraison, mode_paiement, payment_provider_id]
    );
    return result.insertId;
  }

  static async addItem(commandeId, ouvrageId, quantite, prixUnitaire) {
    const [result] = await db.query(
      'INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
      [commandeId, ouvrageId, quantite, prixUnitaire]
    );
    return result.insertId;
  }

  static async findByClient(clientId) {
    const [rows] = await db.query(`
      SELECT c.*, COUNT(ci.id) as nombre_items
      FROM commandes c
      LEFT JOIN commande_items ci ON c.id = ci.commande_id
      WHERE c.client_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [clientId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM commandes WHERE id = ?', [id]);
    return rows[0];
  }

  static async getItems(commandeId) {
    const [rows] = await db.query(`
      SELECT ci.*, o.titre, o.auteur
      FROM commande_items ci
      JOIN ouvrages o ON ci.ouvrage_id = o.id
      WHERE ci.commande_id = ?
    `, [commandeId]);
    return rows;
  }

  static async updateStatus(id, statut) {
    const [result] = await db.query(
      'UPDATE commandes SET statut = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [statut, id]
    );
    return result.affectedRows > 0;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT c.*, u.nom as client_nom, COUNT(ci.id) as nombre_items
      FROM commandes c
      LEFT JOIN users u ON c.client_id = u.id
      LEFT JOIN commande_items ci ON c.id = ci.commande_id
    `;
    const params = [];

    if (filters.statut) {
      query += ' WHERE c.statut = ?';
      params.push(filters.statut);
    }

    query += ' GROUP BY c.id ORDER BY c.created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getCommandeComplete(id) {
    const commande = await this.findById(id);
    if (!commande) return null;

    const items = await this.getItems(id);
    return { ...commande, items };
  }
}

export default Commande;
