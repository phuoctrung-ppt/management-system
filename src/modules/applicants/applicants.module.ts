import { forwardRef, Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from './entities/applicants.entity';
import { QueueModule } from '../queue/queue.module';
import { PROCESS_SCANNING_QUEUE } from 'src/shared/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesModule } from '../files/files.module';
import { FilesService } from '../files/files.service';
import { OpenAIModule } from '../open-ai/open-ai.module';

@Module({
  controllers: [ApplicantsController],
  providers: [ApplicantsService, FilesService],
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
    FilesModule,
    forwardRef(() => OpenAIModule),
  ],
  exports: [ApplicantsService],
})
export class ApplicantsModule {}
