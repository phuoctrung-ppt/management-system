import {
  Body,
  Controller,
  FileTypeValidator,
  Param,
  ParseFilePipe,
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
  constructor(
    private readonly applicantsService: ApplicantsService,
  ) {}

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
}
