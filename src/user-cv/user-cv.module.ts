// user-cv/user-cv.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCvService } from './user-cv.service';
import { UserCv } from './user-cv.entity';
import { User } from '../users/user.entity'; // Make sure User is imported

@Module({
  imports: [TypeOrmModule.forFeature([UserCv, User])], // Make sure both UserCv and User are in the forFeature list
  providers: [UserCvService],
  exports: [UserCvService],
})
export class UserCvModule {}
