// upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UserCvModule } from '../user-cv/user-cv.module'; // ✅ Import the module

@Module({
  imports: [UserCvModule], // ✅ Add it to imports
  controllers: [UploadController],
})
export class UploadModule {}
