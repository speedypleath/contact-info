import { CheerioAPI } from 'cheerio';
import { ElementType } from 'domelementtype';
import { readFileSync } from 'fs';

export function extractText($: CheerioAPI) {
  const textNodes = $('*')
    .contents()
    .filter((_, element) => {
      return element.type === ElementType.Text;
    })
    .get();

  return textNodes.map((el) => $(el).text()).join(' ');
}

export function extractPhoneNumbers($: CheerioAPI) {
  // https://ihateregex.io/expr/phone/
  const phoneRegex = /(\+?\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;

  // get all text nodes
  const text = extractText($);
  const phones = text.match(phoneRegex);

  // filter out duplicates
  const uniquePhones = [...new Set(phones)];

  return uniquePhones;
}

export function extractSocialLinks($: CheerioAPI) {
  const socialHandles = [
    'facebook',
    'instagram',
    'twitter',
    'linkedin',
    'youtube',
  ];

  const socialLinks = [];

  socialHandles.forEach((handle) => {
    const res = $(`a[href*="${handle}.com"]`).attr('href');
    if (res) {
      socialLinks.push(res);
    }
  });

  return socialLinks;
}

export async function parseDomainsFromCSV(csv: string) {
  return readFileSync(csv).toString().split('\n').slice(1);
}
