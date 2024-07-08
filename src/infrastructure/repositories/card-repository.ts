import {connectionManager,ConnectionType} from 'src/shared/db_manager';
import { CardDto, TypesOfCard } from '../dto/card.dto';
import { error } from 'console';

export class CardRepository {
    dinersBadPool : any;
    constructor(){
        this.initializeDatabaseConnections();
    }
    private async initializeDatabaseConnections() {
        try {
          this.dinersBadPool = await connectionManager.instancePoolConnection(ConnectionType.DINERS_BAD);
        } catch (error) {
          console.error('Failed to initialize database connections', error);
        }
    }

    async findAllByUserId(userId: number): Promise<CardDto[]> {
        const query = `
            SELECT * FROM cards
            WHERE user_id = ${userId};
        `;
       
        try {
            const result = await this.dinersBadPool.query(query);
            const cards: CardDto[] = result.rows.map((row: { id: number; cardnumber: string; expiration_date: string; cardholdername: string; cardtype: TypesOfCard; securitycode: string; }) => {
                const cardDto = new CardDto();
                cardDto.id = row.id;
                cardDto.cardNumber = row.cardnumber;
                cardDto.expirationDate = row.expiration_date; 
                cardDto.cardHolderName = row.cardholdername;
                cardDto.cardType = row.cardtype;
                cardDto.securityCode = row.securitycode;
                return cardDto;
            });
            return cards;
        } catch (error) {
            console.error('Failed to find cards by user id: ', error);
            throw new Error('Failed to find cards');
        }
    }
    
    async addCardForUser(userId: number, cardDto: CardDto): Promise<CardDto> {
        const query = `
            INSERT INTO cards (user_id, cardnumber, expiration_date, cardholdername, cardtype, securitycode, cash)
            VALUES (
                ${userId},
                '${cardDto.cardNumber}',
                '${cardDto.expirationDate}',
                '${cardDto.cardHolderName}',
                '${cardDto.cardType}',
                '${cardDto.securityCode}',
                ${cardDto.cash}
                
            )
            RETURNING *;
        `;
    
        try {
            const result = await this.dinersBadPool.query(query);
            const row = result.rows[0];
            const insertedCard = new CardDto();
            insertedCard.id = row.id;
            insertedCard.cardNumber = row.cardnumber;
            insertedCard.expirationDate = row.expiration_date;
            insertedCard.cardHolderName = row.cardholdername;
            insertedCard.cardType = row.cardtype;
            insertedCard.securityCode = row.securitycode;
            insertedCard.cardType = row.cash
    
            console.log('Card added successfully');
            return insertedCard;
        } catch (error) {
            console.error('Failed to add card: ', error);
            throw new Error('Failed to add card');
        }
    }

}