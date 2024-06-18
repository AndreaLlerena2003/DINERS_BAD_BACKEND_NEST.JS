import { error } from "console";
import { UserDto } from "../dto/user.dto";
import {connectionManager,ConnectionType} from 'src/shared/db_manager';

export class UserRepository {
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

    async saveUser(user:UserDto): Promise<void>{
       
        const query = `
            INSERT INTO users (username, password, type_of_document, number_of_document, last_8_digits, expiration_date, email, phone)
            VALUES ('${user.username}', '${user.password}', '${user.typeOfDocument}', '${user.numberOfDocument}', '${user.last8Digits}', '${user.date}', '${user.email}', '${user.phone}')
        `;
        try{
            await this.dinersBadPool.query(query);
        }catch(error){
            console.error('Failed to save user: ',error);
        }
    }

    async findOneWithUsernameAndPassword(username:string,password:string): Promise<any>{
        const query = `
           SELECT * FROM users WHERE username='${username}' AND password='${password}'
        `;
        try{
            return await this.dinersBadPool.query(query);
        }catch(error){
            console.error('Failed to find user: ', error);
            throw error;
        }
    }

    async findUserById(id:number): Promise<any>{
        const query = `SELECT * FROM users WHERE id=${id}`;
        try{
            return await this.dinersBadPool.query(query);
        }catch(error){
            console.error("Failed to find user: ", error);
            throw error;
        }
    }

}