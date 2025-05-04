// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';
import { User } from './users/user.entity';
import { JobTitle } from './jobs/job-title.entity';
import { JobsModule } from './jobs/jobs.module';
import { UserCv } from './user-cv/user-cv.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Ensure it loads the environment variables
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, JobTitle, UserCv],
      synchronize: true, // ⚠️ Use only in development
    }),
    AuthModule,
    UsersModule,
    UploadModule,
    AiModule,
    JobsModule,
  ],
})
export class AppModule {}
