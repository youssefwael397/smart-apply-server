// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User> // UserRepository injected correctly
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData); // Creates entity instance
    return await this.userRepository.save(user); // Persists it
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
