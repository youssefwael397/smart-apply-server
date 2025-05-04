// jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobTitle } from './job-title.entity';
import { JobsService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobTitle])],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
