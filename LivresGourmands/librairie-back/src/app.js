// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import des routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import ouvragesRoutes from './routes/ouvrages.routes.js';
import panierRoutes from './routes/panier.routes.js';
import commandesRoutes from './routes/commandes.routes.js';
import commentairesRoutes from './routes/commentaires.routes.js';
import listesCadeauxRoutes from './routes/listes-cadeaux.routes.js';

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/ouvrages', ouvragesRoutes);
app.use('/api/panier', panierRoutes);
app.use('/api/commandes', commandesRoutes);
app.use('/api/commentaires', commentairesRoutes);
app.use('/api/listes-cadeaux', listesCadeauxRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Les Livres Gourmands fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl 
  });
});

// Gestion centralisée des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  
  // Erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Données invalides', 
      details: err.message 
    });
  }

  // Erreurs de base de données
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ 
      error: 'Ressource déjà existante' 
    });
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Token invalide' 
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Token expiré' 
    });
  }

  // Erreur par défaut
  const status = err.status || 500;
  const message = err.message || 'Erreur serveur interne';
  
  res.status(status).json({ 
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
