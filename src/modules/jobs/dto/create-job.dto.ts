import { JobType } from 'src/shared/enum';

export class CreateJobDTO {
  title: string;
  number_of_vacancies: number;
  experience: string;
  requirements: string;
  description: string;
  location: string;
  job_type: JobType;
  salary_range: string;
}
