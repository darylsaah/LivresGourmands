// src/controllers/AuthController.js
import AuthService from '../services/AuthService.js';
import User from '../models/User.js';

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);
      res.json({
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
