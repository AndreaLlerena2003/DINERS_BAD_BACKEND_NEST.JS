import { Controller , Get, Headers, Post,Body, UnauthorizedException,HttpException, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UserDto } from 'src/infrastructure/dto/user.dto';
import { CardDto } from 'src/infrastructure/dto/card.dto';

@Controller('user')
export class UsuarioController {

  constructor(private readonly usuarioService: UsuarioService,
   
  ) {}

  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string): Promise<UserDto | { error: string }> {
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

  @Post('addCard')
  async addCard(
    @Headers('authorization') authHeader: string,
    @Body() cardDto: CardDto
  ): Promise<CardDto> {
    try {
      const token = authHeader.replace('Bearer ', '');
      const addedCard = await this.usuarioService.addCard(token, cardDto);
      return addedCard;

    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        console.error('Error adding card: ', error);
        throw new HttpException('Failed to add card', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


}
