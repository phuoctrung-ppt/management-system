import {
  CacheInterceptor,
  CacheModule as NestCacheModule,
} from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateCache } from './create-cache';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CreateCache,
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'APP_MANAGER',
      useClass: CacheInterceptor,
    },
  ],
})
export class CacheModule {}
