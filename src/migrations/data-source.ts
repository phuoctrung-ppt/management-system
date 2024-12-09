import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();
console.log(join(__dirname, '../migrations/*{.ts,.js}'))
const AppDataSource = new DataSource({
  type: 'postgres', // your database type
  host: process.env.DATABASE_HOST, // your database host
  port: +process.env.DATABASE_PORT, // your database port
  username: process.env.DATABASE_USER, // your database username
  password: process.env.DATABASE_PASSWORD, // your database password
  database: process.env.DATABASE_NAME, // your database name
  //   entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false, // Don't use synchronize in production
  logging: ['query', 'schema', 'error'],
});

export default AppDataSource;
