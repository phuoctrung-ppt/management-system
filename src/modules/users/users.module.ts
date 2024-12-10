import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CacheModule } from '../cache/cache.module';
import UserSeeder from 'src/seeds/seed-admin';
import { ModuleRef } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { SeederFactoryManager } from 'typeorm-extension';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), CacheModule],
})
// export class UsersModule implements OnModuleInit {
//   private readonly logger = new Logger('UsersModule');
//   constructor(private readonly moduleRef: ModuleRef) {}
//   async onModuleInit() {
//     this.logger.fatal('The module has been initialized.');

//     const dataSource = this.moduleRef.get<DataSource>(DataSource);
//     const factoryManager =
//       this.moduleRef.get<SeederFactoryManager>(SeederFactoryManager);
//     const seeding = await new UserSeeder().run(dataSource, factoryManager);
//     this.logger.fatal('The seeding data has been completed with :', seeding);
//   }
// }
export class UsersModule {}
