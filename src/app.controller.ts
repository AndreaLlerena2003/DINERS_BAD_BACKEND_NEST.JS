import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('check-db')
  async getOne(): Promise<any> {
    return this.appService.getIfItWorks();
  }
 
}
