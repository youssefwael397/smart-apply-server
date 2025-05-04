// user-cv/user-cv.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCvService } from './user-cv.service';
import { UserCvController } from './user-cv.controller';
import { UserCv } from './user-cv.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCv, User])],
  providers: [UserCvService],
  controllers: [UserCvController],
  exports: [UserCvService], // التأكد من تصدير UserCvService
})
export class UserCvModule {}
