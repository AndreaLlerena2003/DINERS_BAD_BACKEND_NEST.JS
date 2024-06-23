import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { UserRepository } from 'src/infrastructure/repositories/user-repository';
@Module({
    controllers: [UsuarioController],
    providers: [UsuarioService, UserRepository],
    exports: [UsuarioService],
})
export class UserModule {}
