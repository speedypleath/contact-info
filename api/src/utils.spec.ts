import { extractPhoneNumbers, parseDomainsFromCSV } from './utils';
import { load } from 'cheerio';

describe('Utility functions', () => {
  it('should extract phone numbers from html', () => {
    const html = `
      <div>
        <div>
          <p>Lorem Ipsum</p>
          <h1>555-555-5555</p>
        </div>
        <p>(954) 274-9020</p>
        <h1>555-555-5555</p>
      </div>
    `;

    const $ = load(html);
    const phone = extractPhoneNumbers($);
    expect(phone).toEqual(['555-555-5555', '(954) 274-9020']);
  });

  it('should parse domains from csv', async () => {
    const domains = await parseDomainsFromCSV(
      '/Users/speedypleath/Projects/contact-scraper/src/sample-websites.csv',
    );

    expect(domains.length).toBe(997);
  });
});
