import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 7777,
  username: 'bitravage',
  password: '693721',
  database: 'clarte',
  migrations: ['src/database/migrations/*.ts'],
});
