import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { genSaltSync, hashSync } from 'bcrypt';
import { UserRole } from 'src/shared/enum';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "users" RESTART IDENTITY;');
    const salt = genSaltSync();
    const hashPwd = hashSync('admin', salt);
    const repository = dataSource.getRepository(User);
    await repository.insert({
      username: 'admin',
      email: 'admin@admin.com',
      salt: salt,
      password: hashPwd,
      role: UserRole.ADMIN,
    });
  }
}
