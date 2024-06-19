export enum TypesDocument {
    DNI = 'DNI',
    CARNET_EXTRANJERIA = 'CARNET_EXTRANJERIA',
    PASAPORTE = 'PASAPORTE'
}

export class UserDto {
    username: string;
    password:string;
    typeOfDocument:TypesDocument;
    numberOfDocument: string;
    last8Digits: string;
    date: string;
    email: string;
    phone: string;

}