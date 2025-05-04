// ai/ai.module.ts
import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { HttpModule } from '@nestjs/axios';
import { JobsModule } from '../jobs/jobs.module'; // ✅ Add this
import { UsersModule } from '../users/users.module'; // ✅ And this

@Module({
  imports: [
    HttpModule,
    JobsModule, // ✅ make JobsService available
    UsersModule, // ✅ make UsersService available
  ],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
