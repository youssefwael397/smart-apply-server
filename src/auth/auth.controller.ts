import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password
      );
      return this.authService.login(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Forward UnauthorizedException error
      }
      throw new BadRequestException('Login failed: ' + error.message);
    }
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.register(body.email, body.password);
    } catch (error) {
      throw new BadRequestException('Registration failed: ' + error.message);
    }
  }
}
