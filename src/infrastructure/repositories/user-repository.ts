import { UserDto } from "../dto/user.dto";
import {connectionManager,ConnectionType} from 'src/shared/db_manager';

export class UserRepository {
    dinersGodPool : any;
    constructor(){
        this.initializeDatabaseConnections();
    }

    private async initializeDatabaseConnections() {
        try {
          this.dinersGodPool = await connectionManager.instancePoolConnection(ConnectionType.DINERS_BAD);
        } catch (error) {
          console.error('Failed to initialize database connections', error);
        }
    }

    async saveUser(user:UserDto): Promise<void>{
        const query = `
            INSERT INTO users (username, password, type_of_document, number_of_document, last8_digits, date, email, phone)
            VALUES ('${user.username}', '${user.password}', '${user.typeOfDocument}', '${user.numberOfDocument}', '${user.last8Digits}', '${user.date}', '${user.email}', '${user.phone}')
        `;
        try{
            await this.dinersGodPool.query(query);
        }catch(error){
            console.error('Failed to save user: ',error);
        }
    }

    //get user by id

}