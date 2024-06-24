import { CardDto } from "./card.dto";

export enum TypesDocument {
    DNI = 'DNI',
    CARNET_EXTRANJERIA = 'CARNET_EXTRANJERIA',
    PASAPORTE = 'PASAPORTE'
}

export class UserDto {
    id?: number;
    username: string;
    password:string;
    typeOfDocument:TypesDocument;
    numberOfDocument: string;
    cards: CardDto[];
    email: string;
    phone: string;

    constructor(data: any) {
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.typeOfDocument = data.type_of_document;
        this.numberOfDocument = data.number_of_document;
        this.email = data.email;
        this.phone = data.phone;

        
        this.cards = [];
        if (data.card) {
            this.cards.push(new CardDto(data.card));
        } else if (data.cards && Array.isArray(data.cards)) {
            this.cards = data.cards.map((cardData: any) => new CardDto(cardData));
        }
    }

}