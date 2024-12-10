import { Injectable } from '@nestjs/common';
import { ApplicantDTO } from './dto/applicant.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Applicant } from './entities/applicants.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectRepository(Applicant)
    private readonly applicantRepo: Repository<Applicant>,
  ) {}

  async applyToJob(
    applicantDTO: ApplicantDTO,
    jobId: string,
    { id }: Partial<User>,
  ) {
    const applicant = { ...applicantDTO, job_id: jobId, user_id: id };
    const createdApplicant = this.applicantRepo.create(applicant);
    return this.applicantRepo.save(createdApplicant);
  }
}
