import { error } from "console";
import { UserDto } from "../dto/user.dto";
import {connectionManager,ConnectionType} from 'src/shared/db_manager';
import * as bcrypt from 'bcrypt';

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
    
    async saveUser(user:UserDto): Promise<UserDto>{
       
        const query = `
            INSERT INTO users (username, password, type_of_document, number_of_document, cardNumber, expiration_date, email, phone)
            VALUES ('${user.username}', '${user.password}', '${user.typeOfDocument}', '${user.numberOfDocument}', '${user.cardNumber}', '${user.date}', '${user.email}', '${user.phone}')
        `;
        try{
            const results = await this.dinersBadPool.query(query);
            return new UserDto(results.rows[0]);
        }catch(error){
            console.error('Failed to save user: ',error);
            throw new Error('Failed to save user');
        }
    }

    /*
        FUNCION CON CONSULTA PARAMETRIZADA

        async saveUser(user: UserDto): Promise<UserDto> {
        const query = `
            INSERT INTO users (username, password, type_of_document, number_of_document, cardNumber, expiration_date, email, phone)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            user.username,
            user.password,
            user.typeOfDocument,
            user.numberOfDocument,
            user.cardNumber,
            user.date,
            user.email,
            user.phone
        ];

        try {
            const results = await this.dinersBadPool.query(query, values);
            return new UserDto(results.rows[0]);
        } catch (error) {
            console.error('Failed to save user: ', error);
            throw new Error('Failed to save user');
        }
        }
    */

    async findOneWithUsernameAndPassword(username: string, password: string): Promise<UserDto | null> {
        const query = `
            SELECT * FROM users WHERE username='${username}';
        `;
        try {
            const result = await this.dinersBadPool.query(query);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return new UserDto(user);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (error) {
            console.error('Failed to find user: ', error);
            throw new Error('Failed to find user');
        }
    }

    async findUserById(id:number): Promise<UserDto>{
        const query = `SELECT * FROM users WHERE id=${id}`;
        try{
            const result =  await this.dinersBadPool.query(query);
            const user = result.rows[0];
            return new UserDto(user);
        }catch(error){
            console.error("Failed to find user: ", error);
            throw error;
        }
    }

}