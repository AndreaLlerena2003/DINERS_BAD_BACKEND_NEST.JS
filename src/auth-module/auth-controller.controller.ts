import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { UserDto } from 'src/infrastructure/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    async signUp(@Body() userDto:UserDto): Promise<void>{
        await this.authService.signUp(userDto);
    }


}
