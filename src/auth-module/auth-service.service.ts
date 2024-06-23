import { Injectable } from '@nestjs/common';
import { Console } from 'console';
import { TypesDocument, UserDto } from 'src/infrastructure/dto/user.dto';
import { UserRepository } from 'src/infrastructure/repositories/user-repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    private readonly userRepository: UserRepository;
   

    constructor(private readonly jwtService: JwtService){
        this.userRepository = new UserRepository();
        
    }

    validationsForSignUp(userDto: UserDto){
        try {
            if (!userDto.password || 
                !userDto.typeOfDocument || 
                !userDto.email || 
                !userDto.date || 
                !userDto.cardNumber || 
                !userDto.numberOfDocument || 
                !userDto.phone) {
                throw new Error('Not all the fields are completed');
            }
            const validTypes = Object.values(TypesDocument);
            if(!validTypes.includes(userDto.typeOfDocument.toUpperCase() as TypesDocument)){
                throw new Error('Invalid type of document');
            } 
            if (userDto.password) {
                const regex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
                if (!regex.test(userDto.password)) {
                    throw new Error("Password does not meet the minimum conditions required");
                }
               
            }
            if(userDto.date){
                let csv = userDto.date;
                let fields = csv.split('/');
                if(fields.length !== 2){
                    throw new Error("Invalid Date Format: Date should be in 'day/month' format");
                }
                if(parseInt(fields[0]) > 31){
                    throw new Error("Invalid Date");
                }
                if(parseInt(fields[1]) > 12){
                    throw new Error("Invalid Date");
                }
            }
            if(userDto.email){
                let emailValid = userDto.email;
                let fields = emailValid.split('@');
                if(fields.length !== 2){
                    throw new Error("Invalid email");
                }
                const allowedDomains = ["hotmail.com", "gmail.com", "outlook.com"];
                if(!allowedDomains.includes(fields[1])){
                    throw new Error("Invalid email domain");
                }
            }
            if(userDto.phone){
                if(userDto.phone.length != 9){
                    console.log(userDto.phone);
                    console.log(userDto.phone.length);
                    throw new Error("Invalid phone number");
                }
            }
            if(userDto.numberOfDocument.length != 8){
                throw new Error("Invalid document number");
            }
            if(userDto.cardNumber.length != 16){
                throw new Error("Invalid card number");
            }
        } catch(error) {
            throw new Error(error.message);
        }
    }

    async signUp(userDto: UserDto): Promise<UserDto>{
        try {
            this.validationsForSignUp(userDto);
            const saltOrRounds: number = 10;
            const hashPass = await bcrypt.hash(userDto.password, saltOrRounds);
            userDto.password = hashPass;
            console.log(userDto.password);
            const userResult = await this.userRepository.saveUser(userDto);
            return userResult;
        } catch(error) {
            console.error('Failed to sign up user: ', error);
            throw new Error(`Signup failed: ${error.message || error}`);
        }
    }

    
    async signIn(username: string, password: string): Promise<{ accessToken: string }> {
        const user = await this.userRepository.findOneWithUsernameAndPassword(username, password);
        if (!user) {
          throw new Error('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.id };
        if (!this.jwtService) {
            throw new Error('JwtService is not properly injected');
        }
        return {
            accessToken: await this.jwtService.signAsync(payload),
          };
      }

    
    
}
