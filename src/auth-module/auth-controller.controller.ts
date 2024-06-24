import { Controller, Post, Body , HttpException, HttpStatus , Get, Param, Query} from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { UserDto } from 'src/infrastructure/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    async signUp(@Body() userDto: UserDto): Promise<UserDto> {
        try {
            return await this.authService.signUp(userDto);
        } catch (error) {
            if (error.message === 'Username already exists') {
                throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
            } else {
                console.error('Unexpected error during signup: ', error);
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
        }
    }

    @Get('signin')
    async signIn(@Query('username') username: string, @Query('password') password: string): Promise<{ accessToken: string }> {
        try {
            return await this.authService.signIn(username, password);
        } catch (error) {
            throw new HttpException(error.message || 'SignIn failed', HttpStatus.BAD_REQUEST);
        }
    }


}
