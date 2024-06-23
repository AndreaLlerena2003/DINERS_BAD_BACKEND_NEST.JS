import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/user-repository';
import { TypesDocument, UserDto } from 'src/infrastructure/dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuarioService {
    private readonly userRepository: UserRepository;
    constructor(private readonly jwtService: JwtService){
        this.userRepository = new UserRepository();
        
    }

    async getProfile(token: string): Promise<UserDto> {
        try {
          const decodedToken = await this.jwtService.verifyAsync(token);
          const userId = decodedToken.sub;
          const user = await this.userRepository.findUserById(userId);
          if (!user) {
            throw new Error('Invalid user');
          }
          return user;
        } catch (error) {
          throw new Error('Invalid token');
        }
    }
    
}
