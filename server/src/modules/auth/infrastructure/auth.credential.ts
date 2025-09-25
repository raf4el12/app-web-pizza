import * as jwt from 'jsonwebtoken';
import { User, RoleType } from '../domain/entities/user.entity';

interface JwtPayload {
  userId: number;
  email: string;
  role: RoleType;
  iat?: number;
  exp?: number;
}

interface TokenConfig {
  secret: string;
  expiresIn: string;
}

const ACCESS_TOKEN_CONFIG: TokenConfig = {
  secret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
  expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
};

const REFRESH_TOKEN_CONFIG: TokenConfig = {
  secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

export class AuthCredential {
  static generateAccessToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role?.name || RoleType.CUSTOMER
    };

    return jwt.sign(payload, ACCESS_TOKEN_CONFIG.secret, {
      expiresIn: ACCESS_TOKEN_CONFIG.expiresIn
    } as jwt.SignOptions);
  }

  static generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role?.name || RoleType.CUSTOMER
    };

    return jwt.sign(payload, REFRESH_TOKEN_CONFIG.secret, {
      expiresIn: REFRESH_TOKEN_CONFIG.expiresIn
    } as jwt.SignOptions);
  }

  static verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, ACCESS_TOKEN_CONFIG.secret) as JwtPayload;
    } catch (error) {
      throw new Error('Token de acceso inválido o expirado');
    }
  }

  static verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, REFRESH_TOKEN_CONFIG.secret) as JwtPayload;
    } catch (error) {
      throw new Error('Token de actualización inválido o expirado');
    }
  }

  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

export { JwtPayload };