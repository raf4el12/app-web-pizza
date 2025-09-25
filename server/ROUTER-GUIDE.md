# 🗺️ Sistema de Rutas Centralizado

Este proyecto ahora utiliza un sistema de rutas centralizado para mantener el código limpio y organizado.

## 📁 Estructura

```
src/
├── routes/
│   ├── index.ts          # Router principal
│   └── README.md         # Guía para agregar módulos
├── modules/
│   └── auth/             # Módulo de autenticación
└── app.ts                # Configuración del servidor
```

## 🚀 Cómo funciona

### Router Principal (`src/routes/index.ts`)

```typescript
export function createRouter(prisma: PrismaClient): express.Router {
  const router = express.Router();
  
  // Inicializar módulos
  const authModule = AuthModule.create(prisma);
  
  // Configurar rutas
  router.use('/auth', authModule.routes);
  
  return router;
}
```

### Integración en App (`src/app.ts`)

```typescript
private initializeRoutes(): void {
  const { createRouter } = require('./routes');
  const apiRouter = createRouter(this.prisma);
  
  // Todas las rutas bajo /api
  this.app.use('/api', apiRouter);
}
```

## 📋 Rutas Disponibles

Todas las rutas están bajo el prefijo `/api`:

### 🔐 Autenticación (`/api/auth/*`)
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión  
- `POST /api/auth/refresh-token` - Renovar token
- `GET /api/auth/me` - Perfil del usuario
- `POST /api/auth/logout` - Cerrar sesión

### ⚕️ Sistema (`/api/*`)
- `GET /api/health` - Health check del API
- `GET /health` - Health check del servidor

## ➕ Cómo Agregar Nuevos Módulos

### 1. Crear el módulo siguiendo DDD

```
src/modules/orders/
├── domain/
│   ├── entities/order.entity.ts
│   └── repositories/order.repository.ts
├── application/
│   ├── dto/order.dto.ts
│   └── use-cases/order.usecase.ts
├── infrastructure/
│   └── persistence/prisma-order.repository.ts
├── interfaces/
│   ├── controllers/order.controller.ts
│   └── routes/order.routes.ts
└── index.ts
```

### 2. Crear el archivo index del módulo

```typescript
// src/modules/orders/index.ts
export class OrderModule {
  static create(prisma: PrismaClient) {
    const orderRepository = new PrismaOrderRepository(prisma);
    const orderUseCase = new OrderUseCase(orderRepository);
    const orderController = new OrderController(orderUseCase);
    const orderRoutes = new OrderRoutes(orderController);

    return {
      routes: orderRoutes.getRouter(),
      orderUseCase,
      orderController,
      orderRepository
    };
  }
}
```

### 3. Agregar al router principal

```typescript
// src/routes/index.ts
import { OrderModule } from '../modules/orders';

export function createRouter(prisma: PrismaClient): express.Router {
  const router = express.Router();

  const authModule = AuthModule.create(prisma);
  const orderModule = OrderModule.create(prisma); // ← Nuevo

  router.use('/auth', authModule.routes);
  router.use('/orders', orderModule.routes); // ← Nuevo
  
  return router;
}
```

### 4. ¡Listo! Las rutas estarán disponibles

- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/:id` - Obtener orden
- etc.

## 🎯 Beneficios de este Sistema

✅ **Centralizado**: Todas las rutas en un lugar  
✅ **Escalable**: Fácil agregar nuevos módulos  
✅ **Limpio**: Separación clara de responsabilidades  
✅ **Modular**: Cada módulo es independiente  
✅ **Tipado**: TypeScript en todo el sistema  
✅ **Consistente**: Mismo patrón para todos los módulos  

## 📝 Próximos Módulos Sugeridos

Para tu app de pizzas, podrías crear estos módulos:

- **Users**: Gestión avanzada de usuarios
- **Orders**: Sistema de órdenes
- **Pizzas**: Catálogo de pizzas
- **Categories**: Categorías de productos
- **Ingredients**: Gestión de ingredientes
- **Addresses**: Direcciones de entrega
- **Promotions**: Sistema de promociones

Cada uno seguirá el mismo patrón y se integrará fácilmente al router principal.