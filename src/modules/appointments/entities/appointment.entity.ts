import { Applicant } from 'src/modules/applicants/entities/applicants.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column('text', { array: true })
  time_slot: string[];

  @Column({ type: 'uuid' })
  applicant_id: string;

  @ManyToOne(() => Applicant, (applicant) => applicant.id)
  @JoinColumn({ name: 'applicant_id' })
  applicant: Applicant;

  @Column({ type: 'uuid' })
  recruiter_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'recruiter_user_id' })
  recruiter: User;
}
