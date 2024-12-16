import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { OpenAI } from 'openai';
import { join } from 'path';
import * as pdfParse from 'pdf-parse';
import { ApplicantStatus } from 'src/shared/enum';
import { ApplicantsService } from '../applicants/applicants.service';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class OpenAIService {
  private readonly openAI: OpenAI;
  @Inject(forwardRef(() => JobsService))
  private readonly jobService: JobsService;
  @Inject(forwardRef(() => ApplicantsService))
  private readonly applicantService: ApplicantsService;
  private readonly logger = new Logger(OpenAIService.name);

  constructor(private readonly configService: ConfigService) {
    this.openAI = new OpenAI({
      apiKey: this.configService.get('open-ai.api-key'),
      project: this.configService.get('open-ai.project-id'),
    });
  }

  async compareWithJobDescription(
    resumeUrl: string,
    job_id: string,
    applicant_id: string,
  ) {
    try {
      const filePath = join(__dirname, '..', '..', '..', '..', resumeUrl);
      this.logger.log(
        `Process scanning cv with data: ${filePath},  job_id: ${job_id}, applicant_id: ${applicant_id}`,
      );
      if (!existsSync(filePath)) {
        return new Error('File not found');
      }
      const pdfData = await pdfParse(filePath);
      const resumeText = pdfData.text;
      const job = await this.jobService.getJobById(job_id);
      const jobRequirements = job.requirement;
      const response = await this.promptReviewCV(resumeText, jobRequirements);
      if (response) {
        this.applicantService.updateApplicant({
          id: applicant_id,
          matched_with: response.trim(),
          status: ApplicantStatus.AI_REVIEW,
        });
      }
    } catch (error) {
      this.logger.error(
        'Error reading resume from URL:',
        error,
        `with path: ${join(__dirname, '..', '..', '..', '..', resumeUrl)}`,
      );
      throw error;
    }
  }

  async promptReviewCV(
    resume: string,
    jobRequirement: string,
  ): Promise<string> {
    const response = await this.openAI.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert career advisor. Compare the following: ${jobRequirement}`,
        },
        {
          role: 'user',
          content: `Candidate's resume: ${resume}`,
        },
        {
          role: 'user',
          content: `Return only the matching percentage as a single value. For example: "95%". Do not include additional information or JSON format.`,
        },
      ],
      temperature: 0.75,
    });
    return response.choices[0].message.content as unknown as string;
  }
}
