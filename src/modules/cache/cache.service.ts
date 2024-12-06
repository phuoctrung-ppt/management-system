import { CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private readonly cacheTtl: number;

  constructor(
    @Inject('CACHE_MANAGER') private readonly cache: CacheStore,
    private readonly configService: ConfigService,
  ) {
    this.cacheTtl = this.configService.get<number>('redis.ttl');
  }

  createCacheKey(name: string, userId: string) {
    return `${name}:${userId}`;
  }

  async set<T>(userId: string, key: string, value: T) {
    const cacheKey = this.createCacheKey(key, userId);
    return this.cache.set(cacheKey, JSON.stringify(value), {
      ttl: this.cacheTtl,
    });
  }

  async get(key: string): Promise<string> {
    return this.cache.get(key);
  }
}
