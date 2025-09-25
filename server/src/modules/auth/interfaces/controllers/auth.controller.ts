import { Request, Response } from 'express';
import { AuthUseCase } from '../../application/use-cases/auth.usecase';
import { LoginDto, RegisterDto, RefreshTokenDto } from '../../application/dto/auth.dto';

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDto: LoginDto = req.body;

      // Validar datos requeridos
      if (!loginDto.email || !loginDto.password) {
        res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
        return;
      }

      const result = await this.authUseCase.login(loginDto);

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error de autenticación'
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const registerDto: RegisterDto = req.body;

      // Validar datos requeridos
      if (!registerDto.firstName || !registerDto.lastName || !registerDto.email || !registerDto.password) {
        res.status(400).json({
          success: false,
          message: 'Nombre, apellido, email y contraseña son requeridos'
        });
        return;
      }

      // Validar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerDto.email)) {
        res.status(400).json({
          success: false,
          message: 'El formato del email es inválido'
        });
        return;
      }

      // Validar longitud de contraseña
      if (registerDto.password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
        return;
      }

      const result = await this.authUseCase.register(registerDto);

      res.status(201).json({
        success: true,
        message: 'Registro exitoso',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error en el registro'
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshTokenDto: RefreshTokenDto = req.body;

      if (!refreshTokenDto.refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Token de actualización requerido'
        });
        return;
      }

      const result = await this.authUseCase.refreshToken(refreshTokenDto);

      res.status(200).json({
        success: true,
        message: 'Token actualizado exitosamente',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar token'
      });
    }
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'No autorizado'
        });
        return;
      }

      const user = await this.authUseCase.getCurrentUser(req.userId);

      res.status(200).json({
        success: true,
        message: 'Usuario obtenido exitosamente',
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Usuario no encontrado'
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Para JWT, el logout se maneja en el cliente eliminando los tokens
    // Aquí se podría implementar una blacklist de tokens si es necesario
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
  }
}