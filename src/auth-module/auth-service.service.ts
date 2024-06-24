import { Injectable } from '@nestjs/common';
import { Console } from 'console';
import { TypesDocument, UserDto } from 'src/infrastructure/dto/user.dto';
import { UserRepository } from 'src/infrastructure/repositories/user-repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TypesOfCard } from 'src/infrastructure/dto/card.dto';

@Injectable()
export class AuthService {

    private readonly userRepository: UserRepository;
   

    constructor(private readonly jwtService: JwtService){
        this.userRepository = new UserRepository();
        
    }

    async validationsForSignUp(userDto: UserDto) {
        try {
            if (!userDto.password || 
                !userDto.typeOfDocument || 
                !userDto.email || 
                !userDto.cards || 
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
                    throw new Error("Invalid phone number");
                }
            }
    
            if(userDto.numberOfDocument.length != 8){
                throw new Error("Invalid document number");
            }
    
          
            const card = userDto.cards[0];
            if (card.cardNumber.length != 16) {
                throw new Error("Invalid card number");
            }
            if (card.expirationDate) {
                let csv = card.expirationDate;
                let fields = csv.split('/');
                if(fields.length !== 2){
                    throw new Error("Invalid Date Format: Date should be in 'month/year' format");
                }
                if(parseInt(fields[0]) > 12){
                    throw new Error("Invalid Date");
                }
            }
            if (!card.cardHolderName) {
                throw new Error("Card holder name is required");
            }
            if (!card.cardType) {
                throw new Error("Card type is required");
            }
            const validCardTypes = Object.values(TypesOfCard);
            if (!validCardTypes.includes(card.cardType.toUpperCase() as TypesOfCard)) {
                throw new Error("Invalid card type");
            }
        
            if (card.securityCode.length != 3) {
                throw new Error("Invalid security code");
            }
    
        } catch(error) {
            throw new Error(error.message);
        }
    }

    async signUp(userDto: UserDto): Promise<UserDto> {
        try {
            this.validationsForSignUp(userDto);
            const existingUser = await this.userRepository.findByUsername(userDto.username);
            if (existingUser) {
                throw new Error('Username already exists');
            }
            const saltOrRounds: number = 10;
            const hashPass = await bcrypt.hash(userDto.password, saltOrRounds);
            userDto.password = hashPass;
    

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
