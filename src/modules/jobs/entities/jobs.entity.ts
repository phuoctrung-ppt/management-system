import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'src/shared/base-entity';
import { JobStatus, JobType } from 'src/shared/enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
@Entity('jobs')
export class Job extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'smallint', nullable: true })
  number_of_vacancies: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  experience: string;

  @Column({ type: 'text' })
  requirement: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'enum', enum: JobType, default: JobType.FULL_TIME })
  job_type: JobType;

  @Column({ type: 'varchar', length: 100 })
  salary_range: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.OPEN })
  status: JobStatus;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column({ type: 'timestamp', nullable: true })
  ended_date: Date;
}
