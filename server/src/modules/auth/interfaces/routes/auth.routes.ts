import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../../infrastructure/auth.middleware';

export class AuthRoutes {
  private router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Rutas públicas (sin autenticación)
    this.router.post('/login', (req, res) => this.authController.login(req, res));
    this.router.post('/register', (req, res) => this.authController.register(req, res));
    this.router.post('/refresh-token', (req, res) => this.authController.refreshToken(req, res));

    // Rutas protegidas (requieren autenticación)
    this.router.get('/me', 
      AuthMiddleware.authenticate(), 
      (req, res) => this.authController.getCurrentUser(req, res)
    );

    this.router.post('/logout', 
      AuthMiddleware.authenticate(), 
      (req, res) => this.authController.logout(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}