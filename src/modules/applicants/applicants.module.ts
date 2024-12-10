import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from './entities/applicants.entity';

@Module({
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
  imports: [TypeOrmModule.forFeature([Applicant])],
})
export class ApplicantsModule {}
