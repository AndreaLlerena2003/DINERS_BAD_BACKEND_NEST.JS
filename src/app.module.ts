import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModuleModule } from './auth-module/auth-module.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), AuthModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
