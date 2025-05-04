// jobs/jobs.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobTitle } from './job-title.entity';
import { User } from '../users/user.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobTitle)
    private jobRepo: Repository<JobTitle>
  ) {}

  async saveJobs(titles: string[], user: User) {
    const jobs = titles.map((title) => {
      const job = new JobTitle();
      job.title = title;
      job.user = user;
      return job;
    });
    return this.jobRepo.save(jobs);
  }

  async getJobsByUser(userId: string) {
    return this.jobRepo.find({
      where: { user: { id: userId } },
    });
  }
}
