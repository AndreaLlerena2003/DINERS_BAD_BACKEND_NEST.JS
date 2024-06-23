import { Controller , Get, Headers, UnauthorizedException} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UserDto } from 'src/infrastructure/dto/user.dto';

@Controller('user')
export class UsuarioController {

  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string): Promise<UserDto> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const user = await this.usuarioService.getProfile(token);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

}
