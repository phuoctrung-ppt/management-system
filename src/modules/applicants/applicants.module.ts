import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from './entities/applicants.entity';
import { QueueModule } from '../queue/queue.module';
import { PROCESS_SCANNING_QUEUE } from 'src/shared/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
  imports: [
    QueueModule.registerQueueAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: PROCESS_SCANNING_QUEUE,
      useFactory: (ConfigService: ConfigService) => ({
        connection: {
          host: ConfigService.get('redis.host'),
          port: ConfigService.get('redis.port'),
        },
      }),
    }),
    TypeOrmModule.forFeature([Applicant]),
  ],
  exports: [ApplicantsService],
})
export class ApplicantsModule {}
