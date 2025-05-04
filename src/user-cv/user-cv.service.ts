// user-cv/user-cv.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCv } from './user-cv.entity';
import { User } from '../users/user.entity';

@Injectable()
export class UserCvService {
  constructor(
    @InjectRepository(UserCv)
    private cvRepo: Repository<UserCv>,

    @InjectRepository(User) // Add User repository injection here
    private userRepo: Repository<User>
  ) {}

  async createCv(filename: string, path: string, userData: { userId: string }) {
    const user = await this.userRepo.findOne({
      where: { id: userData.userId },
    });
    if (!user) throw new Error('User not found');

    const cv = this.cvRepo.create({ filename, path, user });
    return this.cvRepo.save(cv);
  }
}
