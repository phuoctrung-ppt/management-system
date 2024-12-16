import { ApplicantStatus } from './enum';

export const PROCESS_SCANNING_QUEUE = 'PROCESS_SCANNING_QUEUE';

export const QueueName = {
  AI_SCANNING: 'ai-scanning',
};

export const StatusWithEvent = [
  ApplicantStatus.INVITED,
  ApplicantStatus.REJECTED,
  ApplicantStatus.HIRED,
];
