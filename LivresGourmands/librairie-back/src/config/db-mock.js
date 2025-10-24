// librairie-back/src/config/db-mock.js
// Configuration mock pour les tests sans MySQL

class MockDB {
  constructor() {
    console.log(' Mode mock activé - Pas de connexion MySQL');
  }

  async query(sql, params = []) {
    console.log('Mock query:', sql, params);
    
    // Retourner des données mock selon la requête
    if (sql.includes('SELECT * FROM users WHERE email')) {
      return [[{ id: 1, nom: 'Test User', email: params[0], password_hash: '$2b$10$mock', role: 'client', actif: true }]];
    }
    
    if (sql.includes('INSERT INTO users')) {
      return [{ insertId: 1 }];
    }
    
    if (sql.includes('SELECT * FROM ouvrages')) {
      return [[
        { id: 1, titre: 'Test Book', auteur: 'Test Author', prix: 19.99, stock: 10, categorie_id: 1 },
        { id: 2, titre: 'Another Book', auteur: 'Another Author', prix: 24.99, stock: 5, categorie_id: 1 }
      ]];
    }
    
    if (sql.includes('SELECT * FROM categories')) {
      return [[
        { id: 1, nom: 'Roman', description: 'Livres de fiction' },
        { id: 2, nom: 'Science', description: 'Livres scientifiques' }
      ]];
    }
    
    // Par défaut, retourner un tableau vide
    return [[]];
  }

  async getConnection() {
    return Promise.resolve();
  }

  async end() {
    console.log('Mock DB connection ended');
  }
}

export default new MockDB();
