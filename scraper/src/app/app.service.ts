import { Injectable, Logger } from '@nestjs/common';
import { gotScraping } from 'got-scraping';
import { load } from 'cheerio';
import { extractPhoneNumbers, extractSocialLinks } from '../utils';
import { WebsitesService } from '../websites/websites.service';
import { Website } from 'src/websites/types/website';

@Injectable()
export class AppService {
  constructor(private readonly websitesService: WebsitesService) {}
  private readonly logger = new Logger(AppService.name);

  async getInfo(website: Website): Promise<any> {
    const response = await gotScraping({
      url: `https://${website.domain}`,
      timeout: {
        request: 20000,
      },
    })
      .catch((_) => {
        this.logger.warn(`${website.domain}: trying http`);
        return gotScraping({
          url: `http://${website.domain}`,
          timeout: {
            request: 20000,
          },
        });
      })
      .catch((_) => {
        this.logger.error(`${website.domain}: website unreachable`);
      });

    if (!response) {
      return;
    }

    this.logger.log(`${website.domain}: successful`);

    let body = response.body;

    // remove script tags
    body = body.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      '',
    );

    // remove style tags
    body = body.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    const $ = load(body);

    website.phones = extractPhoneNumbers($);
    website.socialLinks = extractSocialLinks($);

    this.websitesService.indexWebsite(website);

    return website;
  }

  async search(text: string): Promise<any> {
    return this.websitesService.search(text);
  }
}
