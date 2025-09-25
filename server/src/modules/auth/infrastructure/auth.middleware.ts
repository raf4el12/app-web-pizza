import { Request, Response, NextFunction } from 'express';
import { AuthCredential, JwtPayload } from '../infrastructure/auth.credential';
import { RoleType } from '../domain/entities/user.entity';

interface AuthenticatedRequest extends Request {
  userId?: number;
  userEmail?: string;
  userRole?: RoleType;
}

export class AuthMiddleware {
  static authenticate() {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        const token = AuthCredential.extractTokenFromHeader(authHeader);

        if (!token) {
          return res.status(401).json({
            success: false,
            message: 'Token de acceso requerido'
          });
        }

        const payload: JwtPayload = AuthCredential.verifyAccessToken(token);

        // Agregar datos del usuario al request
        req.userId = payload.userId;
        req.userEmail = payload.email;
        req.userRole = payload.role;

        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido o expirado'
        });
      }
    };
  }

  static authorize(allowedRoles: RoleType[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.userRole) {
          return res.status(401).json({
            success: false,
            message: 'No autorizado'
          });
        }

        if (!allowedRoles.includes(req.userRole)) {
          return res.status(403).json({
            success: false,
            message: 'Acceso denegado - Permisos insuficientes'
          });
        }

        next();
      } catch (error) {
        return res.status(403).json({
          success: false,
          message: 'Error de autorización'
        });
      }
    };
  }

  static adminOnly() {
    return AuthMiddleware.authorize([RoleType.ADMIN]);
  }

  static customerOrAdmin() {
    return AuthMiddleware.authorize([RoleType.CUSTOMER, RoleType.ADMIN]);
  }
}

export { AuthenticatedRequest };