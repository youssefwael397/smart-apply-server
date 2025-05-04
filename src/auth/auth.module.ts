import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; // ✅ Import this

import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity'; // ✅ Import User entity
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ConfigModule,
    TypeOrmModule.forFeature([User]), // ✅ Register the User repository here
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
