export interface GamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  playtime: number;
  updated: string;
  esrb_rating: EsrbRating | null;
  platforms: PlatformWrapper[];
}

export interface EsrbRating {
  id: number;
  slug: string;
  name: string;
}

export interface PlatformWrapper {
  platform: Platform;
  released_at: string | null;
  requirements?: {
    minimum?: string;
    recommended?: string;
  };
}

export interface Platform {
  id: number;
  slug: string;
  name: string;
}

export interface GameDetail extends Game {
  description_raw: string;
  website: string;
  reddit_url: string;
  developers: {
    id: number;
    name: string;
  }[];
  publishers: {
    id: number;
    name: string;
  }[];
}