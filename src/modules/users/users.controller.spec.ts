import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { CacheModule } from '../cache/cache.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const user = { id: 1, username: 'test', email: 'test@gmail.com' };
    repository = {
      find: jest.fn().mockResolvedValue([user]),
      findOne: jest.fn().mockResolvedValue(user),
      save: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(null),
    } as unknown as jest.Mocked<Repository<User>>;

    cacheService = {
      get: jest.fn(),
      set: jest.fn(),
      createCacheKey: jest
        .fn()
        .mockImplementation((name, id) => `${name}:${id}`),
    } as unknown as jest.Mocked<CacheService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
        {
          provide: CacheService,
          useValue: cacheService,
        },
      ],
      imports: [CacheModule, ConfigModule.forRoot()],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    expect(await controller.findAll()).toEqual([
      {
        id: 1,
        username: 'test',
        email: 'test@gmail.com',
      },
    ]);
  });

  it('should return a user by id and cache it', async () => {
    const user = { id: 1, username: 'test', email: 'test@gmail.com' };
    const cacheKey = 'user:1';
    cacheService.createCacheKey.mockReturnValue(cacheKey);
    const result = await controller.findOne('1');

    expect(cacheService.createCacheKey).toHaveBeenCalledWith('user', '1');
    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(cacheService.set).toHaveBeenCalledWith('1', 'user', user);
    expect(result).toEqual(user);
  });
});
