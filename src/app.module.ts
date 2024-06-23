import { Module , Logger} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule,  ConfigService  } from '@nestjs/config';
import { AuthModuleModule } from './auth-module/auth-module.module';
import { UserModule } from './user-module/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModuleModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
