import { Controller } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Website } from 'src/websites/types/website';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'scrape' })
  getInfo(website: Website) {
    return this.appService.getInfo(website);
  }

  @MessagePattern({ cmd: 'search' })
  search({ text: text }) {
    return this.appService.search(text);
  }
}
