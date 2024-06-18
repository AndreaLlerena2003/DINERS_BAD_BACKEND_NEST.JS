import { Module } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { AuthController } from './auth-controller.controller';
import { UserRepository } from 'src/infrastructure/repositories/user-repository';
@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository]
})
export class AuthModuleModule {}
