import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

// Creamamos una nueva instancia de DataSource con un objeto de configuración
const AppDataSource = new DataSource({
  type: 'mysql',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default AppDataSource;
