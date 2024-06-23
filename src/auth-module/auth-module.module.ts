import { Module } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { AuthController } from './auth-controller.controller';
import { UserRepository } from 'src/infrastructure/repositories/user-repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
  exports: [AuthService],
})
export class AuthModuleModule {}
