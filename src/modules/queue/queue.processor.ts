import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PROCESS_SCANNING_QUEUE, QueueName } from 'src/shared/constants';
import { OpenAIService } from '../open-ai/open-ai.service';

@Processor(PROCESS_SCANNING_QUEUE)
export class QueueProcessor extends WorkerHost {
  private readonly logger = new Logger(QueueProcessor.name);
  constructor(
    @Inject('OpenAIService') private readonly openAIService: OpenAIService,
  ) {
    console.log('🚀 ~ QueueProcessor ~ constructor ~ openAIService:');
    super();
  }
  async process(job: Job): Promise<any> {
    this.logger.log(
      `Processing job ${job.id} with data ${JSON.stringify(job.data)}`,
    );
    switch (job.name === QueueName.AI_SCANNING) {
      default:
        break;
    }
  }
}
