import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity'; // Import the User entity type
import { ConfigService } from '@nestjs/config'; // Import ConfigService

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Injecting UsersService
    private jwtService: JwtService, // Inject JwtService from @nestjs/jwt
    private configService: ConfigService // Inject ConfigService
  ) {}

  // Validate user by email and password
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result; // Return user data without password
    }
    return null; // Return null if user is not found or password doesn't match
  }

  // Generate JWT token for logged-in user
  async login(user: User) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    // The payload can include additional info as needed (e.g., role, username)
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: jwtSecret }), // Pass the secret explicitly
    };
  }

  // Register a new user with email and password
  async register(email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    try {
      return this.usersService.create({ email, password: hashedPassword });
    } catch (error) {
      throw new BadRequestException('Registration failed: ' + error.message);
    }
  }
}
