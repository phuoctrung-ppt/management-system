import { Job } from 'src/modules/jobs/entities/jobs.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'src/shared/base-entity';
import { ApplicantStatus } from 'src/shared/enum';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    Unique
} from 'typeorm';

@Entity('applicants')
@Unique(['user_id', 'job_id'])
export class Applicant extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  phone_number: string;

  @Column({
    type: 'enum',
    enum: ApplicantStatus,
    default: ApplicantStatus.APPLIED,
  })
  status: ApplicantStatus;

  @Column({ type: 'text' })
  resume: string;

  @Column({ type: 'date' })
  submitted_at: Date;

  @Column({ type: 'uuid' })
  job_id: string;

  @ManyToOne(() => Job, (job) => job.id)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
