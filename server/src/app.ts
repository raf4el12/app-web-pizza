import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { createRouter } from './routes';

class App {
  public app: Application;
  private prisma: PrismaClient;

  constructor() {
    this.app = express();
    this.prisma = new PrismaClient();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));

    // Logging
    this.app.use(morgan('combined'));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
      });
    });
  }

  private initializeRoutes(): void {
    // Crear el router centralizado
    const apiRouter = createRouter(this.prisma);

    // Registrar todas las rutas bajo /api
    this.app.use('/api', apiRouter);

    // Ruta 404 - usar función sin patrón específico
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl
      });
    });

    // Error handling middleware
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    });
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(` Server running on port ${port}`);
      console.log(` API Health check: http://localhost:${port}/api/health`);
      console.log(` Server Health check: http://localhost:${port}/health`);
      console.log(` Auth endpoints: http://localhost:${port}/api/auth`);
      console.log(` Available endpoints:`);
      console.log(`   - POST /api/auth/register`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - POST /api/auth/refresh-token`);
      console.log(`   - GET /api/auth/me`);
      console.log(`   - POST /api/auth/logout`);
    });
  }

  public async closeDatabaseConnection(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default App;