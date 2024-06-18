import { Injectable } from '@nestjs/common';
import { TypesDocument, UserDto } from 'src/infrastructure/dto/user.dto';
import { UserRepository } from 'src/infrastructure/repositories/user-repository';

@Injectable()
export class AuthService {

    private readonly userRepository: UserRepository;

    constructor(){
        this.userRepository = new UserRepository();
    }

    validationsForSignUp(userDto: UserDto){
        //validations for sing up 
        
    }

    async signUp(userDto: UserDto): Promise<void>{
        try{
            const validTypes = Object.values(TypesDocument);
            if(!validTypes.includes(userDto.typeOfDocument.toUpperCase() as TypesDocument)){
                throw new Error('Invalid type of document');
            }
            await this.userRepository.saveUser(userDto);
        }catch(error){
            console.error('Failed to sign up user: ', error);
            throw new Error('Signup failed');
        }
    }

}
