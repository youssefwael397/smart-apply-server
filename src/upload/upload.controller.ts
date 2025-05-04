// upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserCvService } from '../user-cv/user-cv.service';

@Controller('upload')
export class UploadController {
  constructor(private userCvService: UserCvService) {}

  @UseGuards(JwtAuthGuard)
  @Post('cv')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const savedCv = await this.userCvService.createCv(
      file.filename,
      file.path, // ✅ fixed here
      req.user
    );
    return savedCv;
  }
}
