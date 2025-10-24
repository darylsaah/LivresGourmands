// src/models/Avis.js
import db from '../config/db.js';

class Avis {
  static async create(avisData) {
    const { client_id, ouvrage_id, note, commentaire } = avisData;
    const [result] = await db.query(
      'INSERT INTO avis (client_id, ouvrage_id, note, commentaire) VALUES (?, ?, ?, ?)',
      [client_id, ouvrage_id, note, commentaire]
    );
    return result.insertId;
  }

  static async findByOuvrage(ouvrageId) {
    const [rows] = await db.query(`
      SELECT a.*, u.nom as client_nom
      FROM avis a
      JOIN users u ON a.client_id = u.id
      WHERE a.ouvrage_id = ?
      ORDER BY a.date DESC
    `, [ouvrageId]);
    return rows;
  }

  static async findByClient(clientId) {
    const [rows] = await db.query(`
      SELECT a.*, o.titre, o.auteur
      FROM avis a
      JOIN ouvrages o ON a.ouvrage_id = o.id
      WHERE a.client_id = ?
      ORDER BY a.date DESC
    `, [clientId]);
    return rows;
  }

  static async findByClientAndOuvrage(clientId, ouvrageId) {
    const [rows] = await db.query(
      'SELECT * FROM avis WHERE client_id = ? AND ouvrage_id = ?',
      [clientId, ouvrageId]
    );
    return rows[0];
  }

  static async update(id, avisData) {
    const { note, commentaire } = avisData;
    const [result] = await db.query(
      'UPDATE avis SET note = ?, commentaire = ? WHERE id = ?',
      [note, commentaire, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM avis WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getStatsByOuvrage(ouvrageId) {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) as nombre_avis,
        AVG(note) as moyenne_notes,
        MIN(note) as note_min,
        MAX(note) as note_max
      FROM avis 
      WHERE ouvrage_id = ?
    `, [ouvrageId]);
    return rows[0];
  }
}

export default Avis;
