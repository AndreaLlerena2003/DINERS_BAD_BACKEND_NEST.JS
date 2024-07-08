import { Controller, Post, Body , HttpException, HttpStatus , Get, Param, Query} from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { UserDto } from 'src/infrastructure/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

   
    @Post('signup')
    async signUp(@Body() userDto: UserDto): Promise<UserDto | { errors: string }> {
      try {
        const result = await this.authService.signUp(userDto);
        return result as UserDto;
      } catch (error) {
        console.error('Error during signup:', error);
        if (error.response && error.response.errors ) {
          throw new HttpException({ errors: error.response.errors }, HttpStatus.BAD_REQUEST);
        }
  
        if (error.message === 'Username already exists') {
          throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
  

    @Get('signin')
    async signIn(@Query('username') username: string, @Query('password') password: string): Promise<{ accessToken: string } | { error: string }> {
        try {
            return await this.authService.signIn(username, password);
            
        } catch (error) {
            throw new HttpException(error.message || 'SignIn failed', HttpStatus.BAD_REQUEST);
        }
    }


}
