// src/models/Commentaire.js
import db from '../config/db.js';

class Commentaire {
  static async create(commentaireData) {
    const { client_id, ouvrage_id, contenu } = commentaireData;
    const [result] = await db.query(
      'INSERT INTO commentaires (client_id, ouvrage_id, contenu) VALUES (?, ?, ?)',
      [client_id, ouvrage_id, contenu]
    );
    return result.insertId;
  }

  static async findByOuvrage(ouvrageId, validatedOnly = false) {
    let query = `
      SELECT c.*, u.nom as client_nom
      FROM commentaires c
      JOIN users u ON c.client_id = u.id
      WHERE c.ouvrage_id = ?
    `;
    const params = [ouvrageId];

    if (validatedOnly) {
      query += ' AND c.valide = true';
    }

    query += ' ORDER BY c.date_soumission DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findPending() {
    const [rows] = await db.query(`
      SELECT c.*, u.nom as client_nom, o.titre as ouvrage_titre
      FROM commentaires c
      JOIN users u ON c.client_id = u.id
      JOIN ouvrages o ON c.ouvrage_id = o.id
      WHERE c.valide = false
      ORDER BY c.date_soumission ASC
    `);
    return rows;
  }

  static async validate(id, validePar) {
    const [result] = await db.query(
      'UPDATE commentaires SET valide = true, date_validation = CURRENT_TIMESTAMP, valide_par = ? WHERE id = ?',
      [validePar, id]
    );
    return result.affectedRows > 0;
  }

  static async reject(id, validePar) {
    const [result] = await db.query(
      'UPDATE commentaires SET valide = false, date_validation = CURRENT_TIMESTAMP, valide_par = ? WHERE id = ?',
      [validePar, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM commentaires WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findByClient(clientId) {
    const [rows] = await db.query(`
      SELECT c.*, o.titre, o.auteur
      FROM commentaires c
      JOIN ouvrages o ON c.ouvrage_id = o.id
      WHERE c.client_id = ?
      ORDER BY c.date_soumission DESC
    `, [clientId]);
    return rows;
  }
}

export default Commentaire;
