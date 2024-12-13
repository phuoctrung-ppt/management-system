import { forwardRef, Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/jobs.entity';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [
    QueueModule,
    TypeOrmModule.forFeature([Job]),
    forwardRef(() => OpenAIModule),
  ],
  exports: [JobsService],
})
export class JobsModule {}
