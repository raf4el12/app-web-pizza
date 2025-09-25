import { PrismaClient } from '@prisma/client';
import { AuthUseCase } from './application/use-cases/auth.usecase';
import { AuthController } from './interfaces/controllers/auth.controller';
import { AuthRoutes } from './interfaces/routes/auth.routes';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { PrismaRoleRepository } from './infrastructure/persistence/prisma-role.repository';

export class AuthModule {
  static create(prisma: PrismaClient) {
    // Repositorios
    const userRepository = new PrismaUserRepository(prisma);
    const roleRepository = new PrismaRoleRepository(prisma);

    // Casos de uso
    const authUseCase = new AuthUseCase(userRepository, roleRepository);

    // Controlador
    const authController = new AuthController(authUseCase);

    // Rutas
    const authRoutes = new AuthRoutes(authController);

    return {
      routes: authRoutes.getRouter(),
      authUseCase,
      authController,
      userRepository,
      roleRepository
    };
  }
}

// Exports para usar en otras partes de la aplicación
export { AuthMiddleware } from './infrastructure/auth.middleware';
export { AuthCredential } from './infrastructure/auth.credential';
export { RoleType, UserStatus } from './domain/entities/user.entity';
export type { AuthenticatedRequest } from './infrastructure/auth.middleware';
export type { 
  LoginDto, 
  RegisterDto, 
  AuthResponseDto, 
  UserResponseDto 
} from './application/dto/auth.dto';