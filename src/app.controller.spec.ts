import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let typeOrmHealthIndicatorMock: jest.Mocked<TypeOrmHealthIndicator>;
  let healthCheckServiceMock: jest.Mocked<HealthCheckService>;

  beforeEach(async () => {
    typeOrmHealthIndicatorMock = {
      pingCheck: jest.fn().mockResolvedValue({
        database: 'up',
      }),
    } as unknown as jest.Mocked<TypeOrmHealthIndicator>;

    healthCheckServiceMock = {
      check: jest.fn().mockImplementation((indicators) => {
        return Promise.all(indicators.map((indicator) => indicator())).then(
          (results) => ({
            status: 'ok',
            details: results.reduce(
              (acc, result) => ({ ...acc, ...result }),
              {},
            ),
          }),
        );
      }),
    } as unknown as jest.Mocked<HealthCheckService>;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: HealthCheckService,
          useValue: healthCheckServiceMock,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: typeOrmHealthIndicatorMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return status OK with database up', async () => {
      const result = await appController.healthCheck();
      expect(result.status).toBe('ok');
      expect(result.detail).toEqual({
        database: 'up',
      });
    });
  });
});
