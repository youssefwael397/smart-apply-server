// ai/ai.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JobsService } from '../jobs/jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('ai')
export class AiController {
  constructor(
    private aiService: AiService,
    private jobsService: JobsService,
    private usersService: UsersService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('suggest-jobs')
  async suggest(@Body() body: { cvText: string }, @Req() req) {
    const titles = await this.aiService.suggestJobs(body.cvText);

    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) throw new Error('User not found');

    await this.jobsService.saveJobs(titles, user);
    return titles;
  }
}
