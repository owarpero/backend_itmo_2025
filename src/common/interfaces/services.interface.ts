export interface UserServiceInterface {
  validateUser(userId: string): Promise<boolean>;
  getUserProfile(userId: string): Promise<UserProfile>;
}

export interface AuthServiceInterface {
  validateToken(token: string): Promise<TokenPayload>;
  validateSession(sessionId: string): Promise<boolean>;
}

export interface MovieMatchingServiceInterface {
  createSession(user1Id: string, user2Id: string): Promise<string>;
  addMoviesToQueue(sessionId: string, movieIds: number[]): Promise<void>;
  getMatches(userId: string): Promise<MovieMatch[]>;
}

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface MovieMatch {
  id: string;
  user1_id: string;
  user2_id: string;
  tmdb_movie_id: number;
  movie_details?: {
    title: string;
    poster_path: string;
    release_date: string;
    overview?: string;
    vote_average?: number;
  };
  matched_at: Date;
}
