import dotenv from 'dotenv';
import App from './app';

// Cargar variables de entorno
dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);

// Crear e iniciar la aplicación
const app = new App();
app.listen(PORT);

// Manejo de señales para un cierre limpio
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await app.closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await app.closeDatabaseConnection();
  process.exit(0);
});