import 'dotenv/config'; // Load .env variables first if you use them for credentials
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '7777', 10),
  username: process.env.DB_USERNAME || 'bitravage', // Replace with your default or use env
  password: process.env.DB_PASSWORD || '693721', // Replace with your default or use env
  database: process.env.DB_DATABASE || 'clarte', // Replace with your default or use env
  entities: [
    // Adjust the path according to your project structure
    // For CLI using ts-node, direct TS path is usually fine:
    join(__dirname, '.././modules/**/*.entity{.ts,.js}'),
    // Example: If entities are in 'src/modules/**/*.entity.ts'
    // join(__dirname, './modules/**/*.entity{.ts,.js}')
  ],
  // Point to your migrations directory
  migrations: [
    // Adjust path as needed. This assumes migrations are in 'src/migrations'
    join(__dirname, '.././migrations/*{.ts,.js}'),
  ],
};
console.log('DataSource loaded successfully');
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
