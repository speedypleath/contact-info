import { Website } from './website';

export interface WebsiteSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: Website;
    }>;
  };
}
