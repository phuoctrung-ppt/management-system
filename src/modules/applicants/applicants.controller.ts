import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { Request as ExpressRequest } from 'express';
import { ApplicantDTO } from './dto/applicant.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  //TODO: Implement Author, the endpoint just granted to the APPLICANT role
  @Post('apply/:jobId')
  @UseInterceptors(FileInterceptor('file'))
  async applyToJob(
    @Param('jobId') jobId: string,
    @Request() req: ExpressRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: Express.Multer.File,
    @Body() applicantDTO: ApplicantDTO,
  ) {
    return this.applicantsService.applyToJob(
      jobId,
      req.user,
      file,
      applicantDTO,
    );
  }

  //TODO: Implement Author, the endpoint just granted to the HR role
  @Patch(':id')
  async updateApplicant(
    @Param('id') id: string,
    @Body() applicantDTO: ApplicantDTO,
  ) {
    const payload = { ...applicantDTO, id };
    return this.applicantsService.updateApplicant(payload);
  }

  @Get(':id')
  async getApplicant(@Param('id') id: string) {
    return this.applicantsService.getApplicant(id);
  }
}
