import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Job } from './entities/jobs.entity';
import { Repository } from 'typeorm';
import { CreateJobDTO } from './dto/create-job.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
  ) {}
  async createJob(job: CreateJobDTO, { id }: Partial<User>) {
    const newJob = { ...job, created_by: id } as unknown as Job;
    const createdJob = this.jobRepo.create(newJob);
    return this.jobRepo.save(createdJob);
  }
}
