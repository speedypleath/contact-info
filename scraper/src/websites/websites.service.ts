import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { WebsiteSearchResult } from './types/websiteSearchResponse';
import { Website } from './types/website';
import { estypes } from '@elastic/elasticsearch';

@Injectable()
export class WebsitesService {
  index = 'websites';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexWebsite(website: Website) {
    return this.elasticsearchService.index({
      index: this.index,
      body: website,
    });
  }

  async search(text: string) {
    const body = await this.elasticsearchService.search<WebsiteSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['domain', 'phones'],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove(websiteId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: websiteId,
          },
        },
      },
    });
  }
}
