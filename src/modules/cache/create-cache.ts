import {
  CacheModuleOptions,
  CacheOptionsFactory,
  CacheStoreFactory,
} from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Injectable()
export class CreateCache implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  async createCacheOptions(): Promise<CacheModuleOptions> {
    const store = (await redisStore({
      socket: {
        host: this.configService.get<string>('redis.host'),
        port: this.configService.get<number>('redis.port'),
      },
      password: this.configService.get<string>('redis.password'),
      ttl: this.configService.get<number>('redis.ttl'),
    })) as unknown as CacheStoreFactory;
    return { store, ttl: this.configService.get<number>('redis.ttl') };
  }
}
