// src/services/AuthService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthService {
  static async register(userData) {
    const { nom, email, password, role = 'client' } = userData;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email déjà utilisé');
    }

    // Hasher le mot de passe
    const password_hash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const userId = await User.create({ nom, email, password_hash, role });

    return { userId, message: 'Utilisateur créé avec succès' };
  }

  static async login(email, password) {
    // Trouver l'utilisateur
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier si le compte est actif
    if (!user.actif) {
      throw new Error('Compte désactivé');
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    };
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.actif) {
        throw new Error('Utilisateur non trouvé ou inactif');
      }

      return {
        userId: user.id,
        role: user.role,
        email: user.email
      };
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByEmail(user.email); // Nécessite l'email
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) {
      throw new Error('Mot de passe actuel incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await User.update(userId, { password_hash: newPasswordHash });

    return { message: 'Mot de passe modifié avec succès' };
  }
}

export default AuthService;
