// users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobTitle } from '../jobs/job-title.entity';
import { UserCv } from 'src/user-cv/user-cv.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => JobTitle, (job) => job.user)
  jobTitles: JobTitle[];

  @OneToMany(() => UserCv, (cv) => cv.user)
  cvs: UserCv[];
}
