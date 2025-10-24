// src/models/Category.js
import db from '../config/db.js';

class Category {
  static async create(categoryData) {
    const { nom, description } = categoryData;
    const [result] = await db.query(
      'INSERT INTO categories (nom, description) VALUES (?, ?)',
      [nom, description]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY nom');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, categoryData) {
    const { nom, description } = categoryData;
    const [result] = await db.query(
      'UPDATE categories SET nom = ?, description = ? WHERE id = ?',
      [nom, description, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default Category;
