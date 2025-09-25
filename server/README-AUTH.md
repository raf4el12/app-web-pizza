# Pizza App - Authentication Module

Este módulo implementa la autenticación y autorización para la aplicación de pizzas utilizando Domain-Driven Design (DDD) y JWT.

## 🏗️ Arquitectura

El módulo sigue los principios de DDD con la siguiente estructura:

```
src/modules/auth/
├── domain/                 # Lógica de negocio
│   ├── entities/          # Entidades de dominio
│   └── repositories/      # Interfaces de repositorio
├── application/           # Casos de uso
│   ├── dto/              # Data Transfer Objects
│   └── use-cases/        # Lógica de aplicación
├── infrastructure/        # Implementaciones técnicas
│   └── persistence/      # Repositorios con Prisma
└── interfaces/           # Capa de presentación
    ├── controllers/      # Controladores REST
    └── routes/          # Definición de rutas
```

## 🚀 Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
npm install --save-dev @types/jsonwebtoken @types/cors
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

### 3. Configurar base de datos

```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Ejecutar seed (opcional - crea usuarios de prueba)
npx ts-node prisma/seed.ts
```

### 4. Ejecutar el servidor

```bash
npm run dev
```

## 📚 API Endpoints

### Autenticación

#### POST `/api/auth/register`
Registrar un nuevo usuario (cliente por defecto).

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@email.com",
  "password": "123456",
  "phone": "+1234567890"
}
```

#### POST `/api/auth/login`
Iniciar sesión.

```json
{
  "email": "admin@pizzaapp.com",
  "password": "admin123"
}
```

#### POST `/api/auth/refresh-token`
Renovar token de acceso.

```json
{
  "refreshToken": "your-refresh-token"
}
```

#### GET `/api/auth/me`
Obtener información del usuario actual (requiere autenticación).

#### POST `/api/auth/logout`
Cerrar sesión (requiere autenticación).

## 🔐 Usuarios de Prueba

Después de ejecutar el seed, tendrás disponibles estos usuarios:

- **Administrador**: `admin@pizzaapp.com` / `admin123`
- **Cliente**: `cliente@test.com` / `customer123`

## 🛡️ Middleware de Autenticación

### Uso básico

```typescript
import { AuthMiddleware } from './modules/auth';

// Proteger ruta (requiere estar autenticado)
app.get('/protected', AuthMiddleware.authenticate(), handler);

// Solo administradores
app.get('/admin-only', 
  AuthMiddleware.authenticate(), 
  AuthMiddleware.adminOnly(), 
  handler
);

// Clientes o administradores
app.get('/customer-or-admin', 
  AuthMiddleware.authenticate(), 
  AuthMiddleware.customerOrAdmin(), 
  handler
);
```

### Acceso a datos del usuario autenticado

```typescript
import { AuthenticatedRequest } from './modules/auth';

const handler = (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const userEmail = req.userEmail;
  const userRole = req.userRole;
  // ... lógica del handler
};
```

## 🔄 Flujo de Autenticación

1. **Registro/Login**: El usuario se registra o inicia sesión
2. **Tokens JWT**: Se generan access token (15min) y refresh token (7 días)
3. **Autenticación**: En cada request, se envía el access token en el header `Authorization: Bearer <token>`
4. **Renovación**: Cuando el access token expira, se usa el refresh token para obtener uno nuevo
5. **Autorización**: Se valida el rol del usuario para acceder a recursos específicos

## 🎯 Roles Disponibles

- **CUSTOMER**: Cliente regular (por defecto al registrarse)
- **ADMIN**: Administrador del sistema
- **STAFF**: Personal (para futuras implementaciones)

## 🧪 Testing

### Probar endpoints con curl

```bash
# Registrarse
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pizzaapp.com","password":"admin123"}'

# Obtener perfil (reemplazar TOKEN)
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📝 Próximas Funcionalidades

- [ ] Verificación de email
- [ ] Recuperación de contraseña
- [ ] Blacklist de tokens para logout seguro
- [ ] Rate limiting para prevenir ataques de fuerza bruta
- [ ] Auditoría de accesos

## 🤝 Uso en Otros Módulos

Para usar la autenticación en otros módulos:

```typescript
import { AuthMiddleware, AuthenticatedRequest, RoleType } from './modules/auth';

// En tus rutas
router.get('/orders', 
  AuthMiddleware.authenticate(),
  AuthMiddleware.customerOrAdmin(),
  orderController.getMyOrders
);

// En tus controladores
const getMyOrders = (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId; // ID del usuario autenticado
  // ... obtener órdenes del usuario
};
```