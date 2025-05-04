// user-cv/user-cv.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class UserCv {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @ManyToOne(() => User, (user) => user.cvs, { onDelete: 'CASCADE' })
  user: User;
}
