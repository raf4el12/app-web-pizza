import express from 'express';
import { AuthModule } from '../modules/auth';
import { PrismaClient } from '@prisma/client';

// Importar aquí otros módulos cuando los crees
// import { UserModule } from '../modules/users';
// import { OrderModule } from '../modules/orders';
// import { PizzaModule } from '../modules/pizzas';

export function createRouter(prisma: PrismaClient): express.Router {
  const router = express.Router();

  // Inicializar módulos
  const authModule = AuthModule.create(prisma);
  
  // Aquí inicializarás otros módulos cuando los crees
  // const userModule = UserModule.create(prisma);
  // const orderModule = OrderModule.create(prisma);
  // const pizzaModule = PizzaModule.create(prisma);

  // Configurar rutas
  router.use('/auth', authModule.routes);
  
  // Aquí irán las demás rutas cuando las crees
  // router.use('/users', userModule.routes);
  // router.use('/orders', orderModule.routes);
  // router.use('/pizzas', pizzaModule.routes);
  // router.use('/categories', categoryModule.routes);
  // router.use('/ingredients', ingredientModule.routes);

  // Ruta de health check para el API
  router.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  return router;
}