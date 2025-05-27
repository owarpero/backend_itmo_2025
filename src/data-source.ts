import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  migrationsRun: true,
  migrations: ['dist/migration/*.js'],
  entities: ['dist/entities/*.js'],
});

if (require.main === module) {
  AppDataSource.initialize()
    .then(() => console.log('Data Source initialized'))
    .catch(err =>
      console.error('Error during Data Source initialization', err),
    );
}
