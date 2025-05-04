// user-cv/user-cv.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserCvService } from './user-cv.service';

@Controller('user-cv')
export class UserCvController {
  constructor(private readonly userCvService: UserCvService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    })
  )
  async uploadCv(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user?.id;

    const savedCv = await this.userCvService.createCv(
      file.filename,
      `/uploads/${file.filename}`,
      { userId }
    );

    return {
      message: 'File uploaded successfully',
      data: savedCv,
    };
  }
}
