import { Controller, Post, Body , HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { UserDto } from 'src/infrastructure/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    async signUp(@Body() userDto: UserDto): Promise<UserDto> {
        try{
            return await this.authService.signUp(userDto);
        }catch(error){
            throw new HttpException(error.message || 'Signup failed', HttpStatus.BAD_REQUEST);
        }

    }


}
