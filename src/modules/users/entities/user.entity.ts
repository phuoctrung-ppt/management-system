import { BaseEntity } from '../../../shared/base-entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { hashSync, genSaltSync } from 'bcrypt';
import { UserRole } from 'src/shared/enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  salt: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true, enum: UserRole })
  role: UserRole;
  
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.salt = genSaltSync();
      this.password = hashSync(this.password, this.salt);
    }
  }
}
