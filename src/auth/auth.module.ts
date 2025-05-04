// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule], // Ensure UsersModule is imported here
  providers: [AuthService, JwtService],
  controllers: [AuthController], // Add AuthController to controllers
})
export class AuthModule {}
