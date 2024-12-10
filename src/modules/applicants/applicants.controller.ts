import { Body, Controller, Param, Post, Request } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { Request as ExpressRequest } from 'express';
import { ApplicantDTO } from './dto/applicant.dto';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post('apply/:jobId')
  async applyToJob(
    @Body() applicantDTO: ApplicantDTO,
    @Param('jobId') jobId: string,
    @Request() req: ExpressRequest,
  ) {
    return this.applicantsService.applyToJob(applicantDTO, jobId, req.user);
  }
}
