import { Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PROCESS_SCANNING_QUEUE, QueueName } from 'src/shared/constants';
import { OpenAIService } from '../open-ai/open-ai.service';

@Processor(PROCESS_SCANNING_QUEUE)
export class QueueProcessor extends WorkerHost {
  private readonly logger = new Logger(QueueProcessor.name);
  constructor(
    @Inject(forwardRef(() => OpenAIService))
    private readonly openAIService: OpenAIService) {
    super();
  }
  async process(job: Job): Promise<any> {
    if (job.name === QueueName.AI_SCANNING) {
      this.logger.log(
        `Processing job ${job.id} with data ${JSON.stringify(job.data)}`,
      );
      const resume = job.data.resume;
      const job_id = job.data.job_id;
      const applicant_id = job.data.applicant_id;
      const reviewResult = await this.openAIService.compareWithJobDescription(
        resume,
        job_id,
        applicant_id,
      );
    }
  }
}
