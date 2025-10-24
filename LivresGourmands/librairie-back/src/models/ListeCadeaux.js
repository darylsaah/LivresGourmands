// src/models/ListeCadeaux.js
import db from '../config/db.js';
import crypto from 'crypto';

class ListeCadeaux {
  static async create(listeData) {
    const { nom, proprietaire_id } = listeData;
    const code_partage = crypto.randomBytes(16).toString('hex');
    
    const [result] = await db.query(
      'INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage) VALUES (?, ?, ?)',
      [nom, proprietaire_id, code_partage]
    );
    return { id: result.insertId, code_partage };
  }

  static async findByCode(code) {
    const [rows] = await db.query(`
      SELECT l.*, u.nom as proprietaire_nom
      FROM listes_cadeaux l
      JOIN users u ON l.proprietaire_id = u.id
      WHERE l.code_partage = ?
    `, [code]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM listes_cadeaux WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByProprietaire(proprietaireId) {
    const [rows] = await db.query(
      'SELECT * FROM listes_cadeaux WHERE proprietaire_id = ? ORDER BY date_creation DESC',
      [proprietaireId]
    );
    return rows;
  }

  static async getItems(listeId) {
    const [rows] = await db.query(`
      SELECT li.*, o.titre, o.auteur, o.prix, o.description
      FROM liste_items li
      JOIN ouvrages o ON li.ouvrage_id = o.id
      WHERE li.liste_id = ?
    `, [listeId]);
    return rows;
  }

  static async addItem(listeId, ouvrageId, quantiteSouhaitee = 1) {
    // Vérifier si l'item existe déjà
    const [existing] = await db.query(
      'SELECT * FROM liste_items WHERE liste_id = ? AND ouvrage_id = ?',
      [listeId, ouvrageId]
    );

    if (existing.length > 0) {
      // Mettre à jour la quantité
      const [result] = await db.query(
        'UPDATE liste_items SET quantite_souhaitee = ? WHERE liste_id = ? AND ouvrage_id = ?',
        [quantiteSouhaitee, listeId, ouvrageId]
      );
      return result.affectedRows > 0;
    } else {
      // Ajouter un nouvel item
      const [result] = await db.query(
        'INSERT INTO liste_items (liste_id, ouvrage_id, quantite_souhaitee) VALUES (?, ?, ?)',
        [listeId, ouvrageId, quantiteSouhaitee]
      );
      return result.insertId;
    }
  }

  static async removeItem(listeId, ouvrageId) {
    const [result] = await db.query(
      'DELETE FROM liste_items WHERE liste_id = ? AND ouvrage_id = ?',
      [listeId, ouvrageId]
    );
    return result.affectedRows > 0;
  }

  static async updateItemQuantity(listeId, ouvrageId, quantiteSouhaitee) {
    const [result] = await db.query(
      'UPDATE liste_items SET quantite_souhaitee = ? WHERE liste_id = ? AND ouvrage_id = ?',
      [quantiteSouhaitee, listeId, ouvrageId]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM listes_cadeaux WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getListeComplete(code) {
    const liste = await this.findByCode(code);
    if (!liste) return null;

    const items = await this.getItems(liste.id);
    return { ...liste, items };
  }
}

export default ListeCadeaux;
