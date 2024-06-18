import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';


export interface DatabaseConfig {
    user: string,
    database: string,
    host: string,
    port: number,
    password: string
}

class DatabaseConnectionManager {
    private static instance: DatabaseConnectionManager;
    private configService: ConfigService;
    private connectionPools: Map<string,Pool>;

    private constructor(){
        this.configService = new ConfigService();
        this.connectionPools = new Map<string,Pool>();

    }

    public static getInstance(): DatabaseConnectionManager{
        if(!DatabaseConnectionManager.instance){
            DatabaseConnectionManager.instance = new DatabaseConnectionManager();
        }
        return DatabaseConnectionManager.instance;
    }

    public getPgConnection(database:string | DatabaseConfig) : Pool{
        const databaseName = typeof database === 'object' ? database.database : database;
        if (!this.connectionPools.has(databaseName)) {
            const newPool = new Pool(
              typeof database === 'object' ? database :
                {
                  user: this.configService.get(`${database.toUpperCase()}_DB_USERNAME`),
                  database: this.configService.get(`${database.toUpperCase()}_DB_DATABASE`),
                  host: this.configService.get(`${database.toUpperCase()}_DB_HOST`),
                  port: this.configService.get(`${database.toUpperCase()}_DB_PORT`),
                  password: this.configService.get(`${database.toUpperCase()}_DB_PASSWORD`),
                }
            );
            this.connectionPools.set(databaseName, newPool);
          }
          return this.connectionPools.get(databaseName);
    }

    public async instancePoolConnection(type: ConnectionType): Promise<Pool> {
        if (type === ConnectionType.DINERS_BAD) {
          return this.getPgConnection('DINERS_BAD');
        } else {
          throw new Error("Incorrect DB Name");
        }
    }
  
}

export enum ConnectionType {
    DINERS_BAD
}

export const connectionManager = DatabaseConnectionManager.getInstance();