import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { OpenAI } from 'openai';
import * as pdfParse from 'pdf-parse';
import { ApplicantsService } from '../applicants/applicants.service';
import { JobsService } from '../jobs/jobs.service';
import { join } from 'path';

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
      this.logger.log(
        `Process scaning cv with data: ${join(__dirname, '..', '..', '..', '..', resumeUrl)},  job_id: ${job_id}, applicant_id: ${applicant_id}`,
      );
      const pdfBuffer = readFileSync(
        join(process.cwd(), '..', '..', '..', '..', resumeUrl),
        'utf-8',
      ).toString();
      const pdfData = await pdfParse(pdfBuffer);
      const resumeText = pdfData.text;
      const job = await this.jobService.getJobById(job_id);
      const jobRequirements = job.requirement;
      const response = await this.promptReviewCV(resumeText, jobRequirements);
      if (response) {
        this.applicantService.updateApplicant({
          id: applicant_id,
          matched_with: response.matched_with,
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
  ): Promise<Record<'matched_with' | 'summary', string>> {
    const prompt = `
      You are an expert career advisor. Compare the following:

      Candidate's resume:
      ${resume}\n

      Job requirements:
      ${jobRequirement}\n

     Provide:
      1. A percentage match.
      2. A summary of the candidate's qualifications.
      3. Return json data like this: {matched_with: 80%, summary: '... with content lower than 50char' }
    `;
    const response = await this.openAI.chat.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.75,
    });
    return response.choices[0].message.content as unknown as Record<
      'matched_with' | 'summary',
      string
    >;
  }
}
