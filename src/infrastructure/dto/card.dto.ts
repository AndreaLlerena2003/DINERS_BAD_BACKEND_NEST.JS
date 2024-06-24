
export enum TypesOfCard {
    CLASSIC = 'CLASSIC',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM',
    BLACK = 'BLACK',
    CORPORATE = 'CORPORATE'
}


export class CardDto {
    id?: number;
    cardNumber: string;
    expirationDate: string;
    cardHolderName: string;
    cardType: TypesOfCard;
    securityCode: string;
    cash: number;

    constructor(data?: any) {
        this.cardNumber = '';
        this.expirationDate = '';
        this.cardHolderName = '';
        this.cardType = TypesOfCard.CLASSIC; 
        this.securityCode = '';
        this.cash = 0;


        if (data) {
            this.id = data.id;
            this.cardNumber = data.cardNumber;
            this.expirationDate = data.expirationDate;
            this.cardHolderName = data.cardHolderName;
            this.cardType = data.cardType;
            this.securityCode = data.securityCode;
            this.cash = data.cash;
        }
    }
}
