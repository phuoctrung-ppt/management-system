import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CacheModule } from '../cache/cache.module';

@Module({
  controllers: [UsersController],
  providers: [ UsersService],
  imports: [TypeOrmModule.forFeature([User]),CacheModule],
})
export class UsersModule {}
