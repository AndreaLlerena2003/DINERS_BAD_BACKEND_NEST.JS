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
    cardNumber: string;
    date: string;
    email: string;
    phone: string;

    constructor(data: any) {
        this.id = data.id
        this.username = data.username;
        this.password = data.password;
        this.typeOfDocument = data.type_of_document;
        this.numberOfDocument = data.number_of_document;
        this.cardNumber = data.cardnumber;
        this.date = data.expiration_date;
        this.email = data.email;
        this.phone = data.phone;
    }

}