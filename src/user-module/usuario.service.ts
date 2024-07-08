import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/user-repository';
import { TypesDocument, UserDto } from 'src/infrastructure/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { CardRepository } from 'src/infrastructure/repositories/card-repository';
import { CardDto, TypesOfCard } from 'src/infrastructure/dto/card.dto';

@Injectable()
export class UsuarioService {
    private readonly userRepository: UserRepository;
    private readonly cardRepository: CardRepository;
  
    constructor(private readonly jwtService: JwtService){
        this.userRepository = new UserRepository();
        this.cardRepository = new CardRepository();
        
    }

    async getProfile(token: string): Promise<UserDto | { error: string }>{
        try {
          const decodedToken = await this.jwtService.verifyAsync(token);
          const userId = decodedToken.sub;
          const user = await this.userRepository.findUserById(userId);
          if (!user) {
            return { error: 'Invalid user' };
          }
          return user;
        } catch (error) {
            return { error: 'Invalid token' };
        }
    }
    
    async addCard(token: string, cardDto: CardDto): Promise<CardDto> {
      try {
        const decodedToken = await this.jwtService.verifyAsync(token);
        const userId = decodedToken.sub;
        const user = await this.userRepository.findUserById(userId);
    
        if (!user) {
          throw new Error('Invalid user');
        }
  
        if (!cardDto.cash) {
          throw new Error('Need cash to insert');
        }
  
        if (cardDto.cardNumber.length !== 16) {
          throw new Error('Invalid card number');
        }
    
        if (cardDto.expirationDate) {
          const fields = cardDto.expirationDate.split('/');
    
          if (fields.length !== 2 || !fields.every(field => /^[0-9]+$/.test(field))) {
            throw new Error("Invalid Date Format: Date should be in 'month/year' format");
          }
    
          const month = parseInt(fields[0], 10);
          const year = parseInt(fields[1], 10);
    
          if (month < 1 || month > 12) {
            throw new Error("Invalid Date: Month should be between 1 and 12");
          }
    
          const currentYear = new Date().getFullYear() % 100;
          if (parseInt(fields[1], 10) < currentYear) {
            throw new Error("Invalid Date: Year should be current or future");
          }
        }
    
        if (!cardDto.cardHolderName) {
          throw new Error('Card holder name is required');
        }
    
        if (!cardDto.cardType) {
          throw new Error('Card type is required');
        }
    
        const validCardTypes = Object.values(TypesOfCard);
        if (!validCardTypes.includes(cardDto.cardType.toUpperCase() as TypesOfCard)) {
          throw new Error('Invalid card type');
        }
    
        if (cardDto.securityCode.length !== 3 || !/^[0-9]+$/.test(cardDto.securityCode)) {
          throw new Error('Invalid security code');
        }
    
        const insertedCard = await this.cardRepository.addCardForUser(userId, cardDto);
        return insertedCard;
    
      } catch (error) {
        console.error('Failed to add card: ', error);
        throw error; 
      }
    }

  

}
