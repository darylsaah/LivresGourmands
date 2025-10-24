import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Charger .env depuis la racine du projet
dotenv.config();

// Configuration par défaut pour les tests
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'livresgourmands',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

console.log("🔧 Configuration DB:", {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

let db;

try {
  db = mysql.createPool(dbConfig);
  
  // Test de connexion
  db.getConnection()
    .then((connection) => {
      console.log(`✅ Connecté à MySQL : ${dbConfig.database}`);
      connection.release();
    })
    .catch((err) => {
      console.error("❌ Erreur de connexion MySQL :", err.message);
      console.log("💡 Pour tester l'API, installez MySQL ou utilisez un service cloud");
      console.log("💡 Voir docs/installation-mysql.md pour les instructions");
    });
} catch (error) {
  console.error("❌ Erreur de configuration MySQL :", error.message);
}

export default db;
