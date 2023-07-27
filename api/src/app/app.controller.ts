import {
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { parseDomainsFromCSV } from 'src/utils';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Website } from 'src/types/types';

@Controller()
export class AppController {
  constructor(@Inject('SCRAPE_SERVICE') private client: ClientProxy) {}

  @Get('index')
  scrapeWebsite(@Query() website: Website) {
    this.client.emit({ cmd: 'scrape' }, website);
  }

  @Post('csv')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async scrapeWebsitesFromCSV(@UploadedFile() file: Express.Multer.File) {
    const websites = parseDomainsFromCSV(`uploads/${file.filename}`);

    for (const website of websites) {
      this.client.emit({ cmd: 'scrape' }, website);
    }
  }

  @Get('search')
  search(@Query('text') text: string): Observable<any> {
    return this.client.send({ cmd: 'search' }, { text: text });
  }
}
