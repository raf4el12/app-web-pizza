/**
 * Ejemplo de cómo agregar nuevos módulos al router principal
 * 
 * Cuando crees nuevos módulos, sigue este patrón:
 */

/*
// 1. Crea el módulo siguiendo la estructura DDD (ejemplo para users)
// src/modules/users/
// ├── domain/
// │   ├── entities/
// │   └── repositories/
// ├── application/
// │   ├── dto/
// │   └── use-cases/
// ├── infrastructure/
// │   └── persistence/
// └── interfaces/
//     ├── controllers/
//     └── routes/

// 2. Crea el archivo index.ts del módulo
// src/modules/users/index.ts
export class UserModule {
  static create(prisma: PrismaClient) {
    const userRepository = new PrismaUserRepository(prisma);
    const userUseCase = new UserUseCase(userRepository);
    const userController = new UserController(userUseCase);
    const userRoutes = new UserRoutes(userController);

    return {
      routes: userRoutes.getRouter(),
      userUseCase,
      userController,
      userRepository
    };
  }
}

// 3. Agrégalo al router principal en src/routes/index.ts
import { UserModule } from '../modules/users';

export function createRouter(prisma: PrismaClient): express.Router {
  const router = express.Router();

  // Módulos existentes
  const authModule = AuthModule.create(prisma);
  
  // Nuevo módulo
  const userModule = UserModule.create(prisma);

  // Rutas
  router.use('/auth', authModule.routes);
  router.use('/users', userModule.routes);
  
  return router;
}

// 4. Las rutas quedarían así:
// - /api/auth/* (autenticación)
// - /api/users/* (gestión de usuarios)
// - /api/orders/* (cuando agregues órdenes)
// - /api/pizzas/* (cuando agregues pizzas)
// etc.
*/

export {};