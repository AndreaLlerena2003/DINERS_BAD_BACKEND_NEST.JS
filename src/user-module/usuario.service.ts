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
    
    async addCard(token: string, cardDto: CardDto):Promise<CardDto | { error: string }> {
      try {

          const decodedToken = await this.jwtService.verifyAsync(token);
          const userId = decodedToken.sub;
          const user = await this.userRepository.findUserById(userId);
          if (!user) {
                return { error: 'Invalid user' };
          }
          if (cardDto.cardNumber.length != 16) {
                return { error: 'Invalid card number' };
          }

          if (cardDto.expirationDate) {
              let fields = cardDto.expirationDate.split('/');
              if (fields.length !== 2) {
                return { error: "Invalid Date Format: Date should be in 'month/year' format" };
              }
              if (parseInt(fields[0]) > 12) {
                return { error: 'Invalid Date' };
              }
          }

          if (!cardDto.cardHolderName) {
              return { error: 'Card holder name is required' };
          }

          if (!cardDto.cardType) {
            return { error: 'Card type is required' };
          }

          const validCardTypes = Object.values(TypesOfCard);
          if (!validCardTypes.includes(cardDto.cardType.toUpperCase() as TypesOfCard)) {
            return { error: 'Invalid card type' };
          }

          if (cardDto.securityCode.length != 3) {
            return { error: 'Invalid security code' };
          }

          const insertedCard = await this.cardRepository.addCardForUser(userId, cardDto);
          return insertedCard;
  
      } catch (error) {
          console.error('Failed to add card: ', error);
          return { error: 'Failed to add card' };
      }
    }

  

}
