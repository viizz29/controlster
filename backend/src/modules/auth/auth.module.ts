import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { PasswordResetTokenRepository } from './password-reset-token.repository';
import { UserOtpRepository } from './user-otp.repository';
import { MailModule } from '../mail/mail.module';
import { TokenBlacklistService } from './token-blacklist.service';
import { JwtStrategy } from 'src/jwt-strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    PasswordResetTokenRepository,
    UserOtpRepository,
    TokenBlacklistService,
  ],
  controllers: [AuthController],
  exports: [TokenBlacklistService],
})
export class AuthModule {}
