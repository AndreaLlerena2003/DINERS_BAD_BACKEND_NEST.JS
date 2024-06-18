import { Injectable } from '@nestjs/common';
import {connectionManager,ConnectionType} from 'src/shared/db_manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  dinersGodPool : any;

  constructor(
    private readonly configService: ConfigService
  ){
    this.initializeDatabaseConnections();
  }

  private async initializeDatabaseConnections() {
    try {
      this.dinersGodPool = await connectionManager.instancePoolConnection(ConnectionType.DINERS_BAD);
    } catch (error) {
      console.error('Failed to initialize database connections', error);
    }
  }

  async getIfItWorks(): Promise<any> {
    if (!this.dinersGodPool) {
      throw new Error('Database connection is not initialized');
    }
    const query = `SELECT 1`;
    const { rows } = await this.dinersGodPool.query(query);
    return rows;
  }

  
}
