import { Module } from '@nestjs/common';

import { WebsitesService } from './websites.service';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from 'src/es/elasticsearch.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SearchModule],
  providers: [WebsitesService],
  exports: [WebsitesService],
})
export class WebsitesModule {}
