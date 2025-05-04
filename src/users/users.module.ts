// users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { User } from './user.entity'; // Import User entity

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Add this line to import the repository
  providers: [UsersService],
  exports: [UsersService], // Export UsersService so it can be imported in other modules
})
export class UsersModule {}
