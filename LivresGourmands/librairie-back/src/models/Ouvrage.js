// src/models/Ouvrage.js
import db from '../config/db.js';

class Ouvrage {
  static async create(ouvrageData) {
    const { titre, auteur, isbn, description, prix, stock, categorie_id } = ouvrageData;
    const [result] = await db.query(
      'INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titre, auteur, isbn, description, prix, stock, categorie_id]
    );
    return result.insertId;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT o.*, c.nom as categorie_nom 
      FROM ouvrages o 
      LEFT JOIN categories c ON o.categorie_id = c.id 
      WHERE o.stock > 0
    `;
    const params = [];

    if (filters.categorie_id) {
      query += ' AND o.categorie_id = ?';
      params.push(filters.categorie_id);
    }

    if (filters.search) {
      query += ' AND (o.titre LIKE ? OR o.auteur LIKE ? OR o.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY o.created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT o.*, c.nom as categorie_nom 
      FROM ouvrages o 
      LEFT JOIN categories c ON o.categorie_id = c.id 
      WHERE o.id = ?
    `, [id]);
    return rows[0];
  }

  static async update(id, ouvrageData) {
    const { titre, auteur, isbn, description, prix, stock, categorie_id } = ouvrageData;
    const [result] = await db.query(
      'UPDATE ouvrages SET titre = ?, auteur = ?, isbn = ?, description = ?, prix = ?, stock = ?, categorie_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [titre, auteur, isbn, description, prix, stock, categorie_id, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM ouvrages WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async updateStock(id, newStock) {
    const [result] = await db.query(
      'UPDATE ouvrages SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStock, id]
    );
    return result.affectedRows > 0;
  }

  static async decrementStock(id, quantity) {
    const [result] = await db.query(
      'UPDATE ouvrages SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND stock >= ?',
      [quantity, id, quantity]
    );
    return result.affectedRows > 0;
  }

  static async getAvisWithStats(ouvrageId) {
    const [rows] = await db.query(`
      SELECT 
        AVG(note) as moyenne_notes,
        COUNT(*) as nombre_avis,
        a.*, u.nom as client_nom
      FROM avis a
      LEFT JOIN users u ON a.client_id = u.id
      WHERE a.ouvrage_id = ?
      GROUP BY a.ouvrage_id
    `, [ouvrageId]);
    return rows[0];
  }

  static async getCommentairesValides(ouvrageId) {
    const [rows] = await db.query(`
      SELECT c.*, u.nom as client_nom
      FROM commentaires c
      LEFT JOIN users u ON c.client_id = u.id
      WHERE c.ouvrage_id = ? AND c.valide = true
      ORDER BY c.date_validation DESC
    `, [ouvrageId]);
    return rows;
  }
}

export default Ouvrage;
