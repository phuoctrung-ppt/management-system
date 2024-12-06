import {
  CacheInterceptor,
  CacheModule as NestCacheModule,
} from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateCache } from './create-cache';
import { CacheService } from './cache.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CreateCache,
      inject: [ConfigService],
    }),
  ],
  providers: [
    CacheService,
    {
      provide: 'APP_MANAGER',
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheService, NestCacheModule],
})
export class CacheModule {}
