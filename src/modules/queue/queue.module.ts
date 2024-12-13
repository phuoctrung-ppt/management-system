import {
  BullModule,
  RegisterQueueAsyncOptions,
  RegisterQueueOptions,
} from '@nestjs/bullmq';
import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueProcessor } from './queue.processor';
import { OpenAIService } from '../open-ai/open-ai.service';
import { OpenAIModule } from '../open-ai/open-ai.module';

@Module({})
export class QueueModule {
  static forRootAsync(): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              connection: {
                host: configService.get('redis.host'),
                port: configService.get('redis.port'),
              },
            };
          },
        }),
      ],
      exports: [BullModule],
      providers: [ConfigService],
    };
  }

  static registerQueue(...options: RegisterQueueOptions[]): DynamicModule {
    const registerQueue = options.map((option) =>
      BullModule.registerQueue(option),
    );
    return {
      module: QueueModule,
      imports: registerQueue,
      exports: registerQueue,
      providers: [QueueProcessor],
    };
  }

  static registerQueueAsync(
    ...options: RegisterQueueAsyncOptions[]
  ): DynamicModule {
    const registerQueue = options.map((option) =>
      BullModule.registerQueueAsync(option),
    );

    return {
      module: QueueModule,
      imports: [forwardRef(() => OpenAIModule), ...registerQueue],
      exports: [BullModule, ...registerQueue],
      providers: [QueueProcessor],
    };
  }
}
