export interface FetchNewsParams {
  function: "NEWS_SENTIMENT";
  tickers?: string;
  topics?: string;
  time_from?: string;
  time_to?: string;
  sort?: "LATEST" | "EARLIEST" | "RELEVANCE";
  limit?: number;
}

export interface NewsFeed {
  items: string;
  sentiment_score_definition: string;
  relevance_score_definition: string;
  feed: NewsArticle[];
  Information?: string;
  "Error Message"?: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image: string | null;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: Topic[];
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: TickerSentiment[];
}

export interface Topic {
  topic: string;
  relevance_score: string;
}

export interface TickerSentiment {
  ticker: string;
  relevance_score: string;
  ticker_sentiment_score: string;
  ticker_sentiment_label: string;
}
