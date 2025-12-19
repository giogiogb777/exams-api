import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'test.db',
  entities: [User],
  synchronize: true,
  logging: false,
});
