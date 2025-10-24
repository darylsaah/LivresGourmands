// src/routes/auth.routes.js
import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Inscription
router.post('/register', validateRegister, AuthController.register);

// Connexion
router.post('/login', validateLogin, AuthController.login);

// Profil utilisateur (protégé)
router.get('/me', authenticateToken, AuthController.getProfile);

export default router;
