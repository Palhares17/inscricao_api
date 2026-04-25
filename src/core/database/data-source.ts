import { DataSource, DataSourceOptions } from 'typeorm';
import { entities } from '../entities/entities';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: entities,
  ssl: process.env.POSTGRES_SSL === 'true',
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
