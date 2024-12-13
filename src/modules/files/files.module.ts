import { DynamicModule, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {
  static registerAsync(): DynamicModule {
    return {
      module: FilesModule,
      imports: [
        TypeOrmModule.forFeature([User]),
        UsersModule,
        MulterModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              dest: configService.get('multer.destination'),
            };
          },
        }),
      ],
      providers: [UsersService],
    };
  }
}
