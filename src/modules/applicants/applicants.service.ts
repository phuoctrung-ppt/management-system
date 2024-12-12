import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApplicantDTO } from './dto/applicant.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Applicant } from './entities/applicants.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { PROCESS_SCANNING_QUEUE, QueueName } from 'src/shared/constants';
import { Queue } from 'bullmq';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectQueue(PROCESS_SCANNING_QUEUE) private readonly queue: Queue,
    @InjectRepository(Applicant)
    private readonly applicantRepo: Repository<Applicant>,
  ) {}

  async applyToJob(
    applicantDTO: ApplicantDTO,
    jobId: string,
    { id }: Partial<User>,
  ) {
    const applicant = { ...applicantDTO, job_id: jobId, user_id: id };
    try {
      const createdApplicant = this.applicantRepo.create(applicant);
      const result = await this.applicantRepo.save(createdApplicant);
      if (result) {
        this.queue.add(QueueName.AI_SCANNING, {
          applicant_id: createdApplicant.id,
          job_id: jobId,
          resume: applicant.resume,
        });
      }
      return result;
    } catch (e) {
      return new HttpException(
        'Failed to apply to job',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
