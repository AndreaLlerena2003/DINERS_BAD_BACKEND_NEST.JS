    import { BadGatewayException, Injectable ,BadRequestException } from '@nestjs/common';
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
            const errors: string[] = [];
            try {
                if (!userDto.password || 
                    !userDto.typeOfDocument || 
                    !userDto.email || 
                    !userDto.cards || 
                    !userDto.numberOfDocument || 
                    !userDto.phone) {
                    console.log('Not all the fields are completed');
                    errors.push('Not all the fields are completed');
                }

                
                const validTypes = Object.values(TypesDocument);
                if(!validTypes.includes(userDto.typeOfDocument.toUpperCase() as TypesDocument)){
                    console.log('Invalid type of document');
                    errors.push('Invalid type of document');
                } 

                
                if (userDto.password) {
                    const regex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
                    if (!regex.test(userDto.password)) {
                        errors.push("Password does not meet the minimum conditions required");
                        console.log("Password does not meet the minimum conditions required");
                    }
                }
        
                if(userDto.email){
                    let emailValid = userDto.email;
                    let fields = emailValid.split('@');
                    if(fields.length !== 2){
                        errors.push("Invalid email");
                        console.log("Invalid email");
                    }
                    const allowedDomains = ["hotmail.com", "gmail.com", "outlook.com"];
                    if(!allowedDomains.includes(fields[1])){
                        errors.push("Invalid email domain");
                        console.log("Invalid email domain");
                    }
                }
        
                if(userDto.phone){
                    if(userDto.phone.length != 9){
                        errors.push("Invalid phone number");
                        console.log("Invalid phone number");
                    }
                }
        
                if(userDto.numberOfDocument.length != 8){
                    errors.push("Invalid document number");
                    console.log("Invalid document number");
                }
        
            
                const card = userDto.cards[0];
                if (card.cardNumber.length != 16) {
                    errors.push("Invalid card number");
                    console.log("Invalid card number");
                }
                if (card.expirationDate) {
                    let csv = card.expirationDate;
                    let fields = csv.split('/');
                    if(fields.length !== 2){
                        errors.push("Invalid Date Format: Date should be in 'month/year' format");
                        console.log("Invalid Date Format: Date should be in 'month/year' format");
                    }
                    if(parseInt(fields[0]) > 12){
                        errors.push("Invalid Date");
                        console.log("Invalid Date");
                    }
                }
                if (!card.cardHolderName) {
                    errors.push("Card holder name is required");
                    console.log("Card holder name is required");
                }
                if (!card.cardType) {
                    errors.push("Card type is required");
                    console.log("Card type is required");
                }
                const validCardTypes = Object.values(TypesOfCard);
                if (!validCardTypes.includes(card.cardType.toUpperCase() as TypesOfCard)) {
                    errors.push("Invalid card type");
                    console.log("Invalid card type");
                }
            
                if (card.securityCode.length != 3) {
                    errors.push("Invalid security code");
                    console.log("Invalid security code");
                }
        
            } catch(error) {
                console.log(error.message);
            }
            return errors;
        }

        async signUp(userDto: UserDto):Promise<UserDto | { errors: string[] }> {
            try {
                const validationErrors = await this.validationsForSignUp(userDto);
                if (validationErrors.length > 0) {
                    return { errors: validationErrors };
                }    
                const existingUser = await this.userRepository.findByUsername(userDto.username);
                if (existingUser) {
                    console.log('Username already exists');
                    return { errors: ['Username already exists'] };
                }
                const saltOrRounds: number = 10;
                const hashPass = await bcrypt.hash(userDto.password, saltOrRounds);
                userDto.password = hashPass;
        

                const userResult = await this.userRepository.saveUser(userDto);
                return userResult;
            } catch(error) {
                console.error('Failed to sign up user: ', error);
                return error;
            }
        }

        
        async signIn(username: string, password: string): Promise<{ accessToken: string } | { error: string }> {
            const user = await this.userRepository.findOneWithUsernameAndPassword(username, password);
            if (!user) {
                return { error: 'Invalid credentials' };
              
            }
            const payload = { username: user.username, sub: user.id };
            if (!this.jwtService) {
                return { error: 'JwtService is not properly injected' };
            }
            return {
                accessToken: await this.jwtService.signAsync(payload),
            };
        }

        
        
    }
