import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'local';

dotenv.config({ path: `.env.${env}` });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/infrastructure/typeorm/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
