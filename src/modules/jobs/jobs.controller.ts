import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateJobDTO } from './dto/create-job.dto';
import { Request as ExpressRequest } from 'express';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobsService) {}
  @Post()
  async createJob(@Body() job: CreateJobDTO, @Request() req: ExpressRequest) {
    return this.jobService.createJob(job, req.user);
  }
}
