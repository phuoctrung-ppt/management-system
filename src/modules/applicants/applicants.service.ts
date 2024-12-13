import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ApplicantDTO, UpdateApplicantDTO } from './dto/applicant.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Applicant } from './entities/applicants.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { PROCESS_SCANNING_QUEUE, QueueName } from 'src/shared/constants';
import { Queue } from 'bullmq';
import { FilesService } from '../files/files.service';

@Injectable()
export class ApplicantsService {
  private readonly logger = new Logger(ApplicantsService.name);
  constructor(
    @InjectQueue(PROCESS_SCANNING_QUEUE) private readonly queue: Queue,
    @InjectRepository(Applicant)
    private readonly applicantRepo: Repository<Applicant>,
    private readonly fileService: FilesService,
  ) {}

  async applyToJob(
    jobId: string,
    { id }: Partial<User>,
    file: Express.Multer.File,
    applicantDTO: ApplicantDTO,
  ) {
    const applicant = { ...applicantDTO, job_id: jobId, user_id: id };
    try {
      const fullPath = await this.fileService.uploadFile(file, { id });
      const createdApplicant = this.applicantRepo.create({
        ...applicant,
        resume: fullPath,
      });
      const result = await this.applicantRepo.save(createdApplicant);
      if (result) {
        this.queue.add(QueueName.AI_SCANNING, {
          applicant_id: createdApplicant.id,
          job_id: jobId,
          resume: fullPath,
        });
      }
      return {
        message: 'Applied to job successfully',
        status: HttpStatus.OK,
        data: {
          id: createdApplicant.id,
          status: createdApplicant.status,
        },
      };
    } catch (e) {
      this.logger.error(e);
      return new HttpException(
        'Failed to apply to job',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateApplicant(applicantDTO: UpdateApplicantDTO) {
    const { id, status, matched_with } = applicantDTO;
    const applicant = await this.applicantRepo.findOne({
      where: { id },
    });
    if (!applicant) {
      return new HttpException('Applicant not found', HttpStatus.NOT_FOUND);
    }
    const updatedApplicant = await this.applicantRepo.save({
      ...applicant,
      status,
      matched_with,
    });
    return updatedApplicant;
  }
}
