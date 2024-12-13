import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantsModule } from '../applicants/applicants.module';
import { Applicant } from '../applicants/entities/applicants.entity';
import { Job } from '../jobs/entities/jobs.entity';
import { JobsModule } from '../jobs/jobs.module';
import { OpenAIService } from './open-ai.service';

@Module({
  imports: [
    forwardRef(() => JobsModule),
    forwardRef(() => ApplicantsModule),
    TypeOrmModule.forFeature([Job, Applicant]),
  ],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
