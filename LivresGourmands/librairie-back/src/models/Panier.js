// src/models/Panier.js
import db from '../config/db.js';

class Panier {
  static async findOrCreateByClient(clientId) {
    // Chercher un panier actif
    let [rows] = await db.query('SELECT * FROM panier WHERE client_id = ? AND actif = true', [clientId]);
    
    if (rows.length === 0) {
      // Créer un nouveau panier
      const [result] = await db.query('INSERT INTO panier (client_id) VALUES (?)', [clientId]);
      const [newRows] = await db.query('SELECT * FROM panier WHERE id = ?', [result.insertId]);
      return newRows[0];
    }
    
    return rows[0];
  }

  static async getItems(panierId) {
    const [rows] = await db.query(`
      SELECT pi.*, o.titre, o.auteur, o.prix as prix_actuel
      FROM panier_items pi
      JOIN ouvrages o ON pi.ouvrage_id = o.id
      WHERE pi.panier_id = ?
    `, [panierId]);
    return rows;
  }

  static async addItem(panierId, ouvrageId, quantite, prixUnitaire) {
    // Vérifier si l'item existe déjà
    const [existing] = await db.query(
      'SELECT * FROM panier_items WHERE panier_id = ? AND ouvrage_id = ?',
      [panierId, ouvrageId]
    );

    if (existing.length > 0) {
      // Mettre à jour la quantité
      const [result] = await db.query(
        'UPDATE panier_items SET quantite = quantite + ?, prix_unitaire = ? WHERE panier_id = ? AND ouvrage_id = ?',
        [quantite, prixUnitaire, panierId, ouvrageId]
      );
      return result.affectedRows > 0;
    } else {
      // Ajouter un nouvel item
      const [result] = await db.query(
        'INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
        [panierId, ouvrageId, quantite, prixUnitaire]
      );
      return result.insertId;
    }
  }

  static async updateItemQuantity(panierId, ouvrageId, quantite) {
    if (quantite <= 0) {
      return await this.removeItem(panierId, ouvrageId);
    }
    
    const [result] = await db.query(
      'UPDATE panier_items SET quantite = ? WHERE panier_id = ? AND ouvrage_id = ?',
      [quantite, panierId, ouvrageId]
    );
    return result.affectedRows > 0;
  }

  static async removeItem(panierId, ouvrageId) {
    const [result] = await db.query(
      'DELETE FROM panier_items WHERE panier_id = ? AND ouvrage_id = ?',
      [panierId, ouvrageId]
    );
    return result.affectedRows > 0;
  }

  static async clear(panierId) {
    const [result] = await db.query('DELETE FROM panier_items WHERE panier_id = ?', [panierId]);
    return result.affectedRows;
  }

  static async calculateTotal(panierId) {
    const [rows] = await db.query(`
      SELECT SUM(quantite * prix_unitaire) as total
      FROM panier_items
      WHERE panier_id = ?
    `, [panierId]);
    return rows[0].total || 0;
  }

  static async deactivate(panierId) {
    const [result] = await db.query(
      'UPDATE panier SET actif = false WHERE id = ?',
      [panierId]
    );
    return result.affectedRows > 0;
  }
}

export default Panier;
