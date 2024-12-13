import { PartialType } from '@nestjs/mapped-types';
import { Applicant } from '../entities/applicants.entity';
export class ApplicantDTO {
  phone_number: string;
  resume?: string;
}

export class UpdateApplicantDTO extends PartialType(Applicant) {}
