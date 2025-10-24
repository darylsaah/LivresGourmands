// src/models/User.js
import db from '../config/db.js';

class User {
  static async create(userData) {
    const { nom, email, password_hash, role = 'client' } = userData;
    const [result] = await db.query(
      'INSERT INTO users (nom, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [nom, email, password_hash, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT id, nom, email, role, actif, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.query('SELECT id, nom, email, role, actif, created_at FROM users ORDER BY created_at DESC');
    return rows;
  }

  static async update(id, userData) {
    const { nom, email, role, actif } = userData;
    const [result] = await db.query(
      'UPDATE users SET nom = ?, email = ?, role = ?, actif = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [nom, email, role, actif, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async hasPurchasedBook(userId, ouvrageId) {
    const [rows] = await db.query(`
      SELECT COUNT(*) as count 
      FROM commande_items ci 
      JOIN commandes c ON ci.commande_id = c.id 
      WHERE c.client_id = ? AND ci.ouvrage_id = ? AND c.statut = 'payee'
    `, [userId, ouvrageId]);
    return rows[0].count > 0;
  }
}

export default User;
