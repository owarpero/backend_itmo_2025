import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { MovieMatch } from '../../entities/movie-match.entity';
import { CreateSessionDto, MovieReactionDto, MovieDetailsDto } from './dto/movie-match.dto';

@Injectable()
export class MovieMatchingService {
  private readonly sessionTTL = 7200; // 2 hours in seconds

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    @InjectRepository(MovieMatch)
    private readonly movieMatchRepository: Repository<MovieMatch>,
  ) {}

  private getSessionKey(sessionId: string): string {
    return `session:${sessionId}:users`;
  }

  private getLikesKey(sessionId: string, userId: string): string {
    return `session:${sessionId}:likes:${userId}`;
  }

  private getDislikesKey(sessionId: string, userId: string): string {
    return `session:${sessionId}:dislikes:${userId}`;
  }

  private getQueueKey(sessionId: string): string {
    return `session:${sessionId}:movie_queue`;
  }

  async createSession(createSessionDto: CreateSessionDto): Promise<string> {
    const { user1_id, user2_id } = createSessionDto;

    if (user1_id === user2_id) {
      throw new BadRequestException('Users in session must be different');
    }

    const sessionId = Math.random().toString(36).substring(2, 15);
    const sessionKey = this.getSessionKey(sessionId);

    try {
      await this.redis
        .multi()
        .sadd(sessionKey, [user1_id, user2_id])
        .expire(sessionKey, this.sessionTTL)
        .exec();

      return sessionId;
    } catch (error) {
      throw new BadRequestException('Failed to create session');
    }
  }

  async addMoviesToQueue(sessionId: string, movieIds: number[]): Promise<void> {
    const sessionKey = this.getSessionKey(sessionId);
    const sessionExists = await this.redis.exists(sessionKey);

    if (!sessionExists) {
      throw new NotFoundException('Session not found');
    }

    const queueKey = this.getQueueKey(sessionId);

    if (movieIds.length > 0) {
      try {
        await this.redis
          .multi()
          .rpush(queueKey, ...movieIds.map(String))
          .expire(queueKey, this.sessionTTL)
          .exec();
      } catch (error) {
        throw new BadRequestException('Failed to add movies to queue');
      }
    }
  }

  async getMatches(userId: string): Promise<MovieMatch[]> {
    return this.movieMatchRepository.find({
      where: [{ user1_id: userId }, { user2_id: userId }],
      order: { matched_at: 'DESC' },
    });
  }

  async likeMovie(sessionId: string, userId: string, movieId: number): Promise<void> {
    const sessionKey = this.getSessionKey(sessionId);
    const sessionExists = await this.redis.exists(sessionKey);

    if (!sessionExists) {
      throw new NotFoundException('Session not found');
    }

    const isUserInSession = await this.redis.sismember(sessionKey, userId);
    if (!isUserInSession) {
      throw new BadRequestException('User is not part of this session');
    }

    const likesKey = this.getLikesKey(sessionId, userId);
    const dislikesKey = this.getDislikesKey(sessionId, userId);

    try {
      await this.redis
        .multi()
        .sadd(likesKey, movieId.toString())
        .srem(dislikesKey, movieId.toString())
        .expire(likesKey, this.sessionTTL)
        .exec();

      await this.checkForMatch(sessionId, movieId);
    } catch (error) {
      throw new BadRequestException('Failed to process like');
    }
  }

  async dislikeMovie(sessionId: string, userId: string, movieId: number): Promise<void> {
    const sessionKey = this.getSessionKey(sessionId);
    const sessionExists = await this.redis.exists(sessionKey);

    if (!sessionExists) {
      throw new NotFoundException('Session not found');
    }

    const isUserInSession = await this.redis.sismember(sessionKey, userId);
    if (!isUserInSession) {
      throw new BadRequestException('User is not part of this session');
    }

    const likesKey = this.getLikesKey(sessionId, userId);
    const dislikesKey = this.getDislikesKey(sessionId, userId);

    try {
      await this.redis
        .multi()
        .sadd(dislikesKey, movieId.toString())
        .srem(likesKey, movieId.toString())
        .expire(dislikesKey, this.sessionTTL)
        .exec();
    } catch (error) {
      throw new BadRequestException('Failed to process dislike');
    }
  }

  private async checkForMatch(sessionId: string, movieId: number): Promise<void> {
    const sessionKey = this.getSessionKey(sessionId);
    const users = await this.redis.smembers(sessionKey);

    if (users.length !== 2) {
      return;
    }

    const [user1, user2] = users;
    const user1Likes = this.getLikesKey(sessionId, user1);
    const user2Likes = this.getLikesKey(sessionId, user2);

    const isMatch = await this.redis.sismember(user1Likes, movieId.toString()) &&
                   await this.redis.sismember(user2Likes, movieId.toString());

    if (isMatch) {
      await this.createMatch(user1, user2, movieId);
    }
  }

  private async createMatch(user1Id: string, user2Id: string, movieId: number): Promise<void> {
    const existingMatch = await this.movieMatchRepository.findOne({
      where: {
        user1_id: user1Id,
        user2_id: user2Id,
        tmdb_movie_id: movieId,
      },
    });

    if (!existingMatch) {
      const match = this.movieMatchRepository.create({
        user1_id: user1Id,
        user2_id: user2Id,
        tmdb_movie_id: movieId,
      });

      await this.movieMatchRepository.save(match);
    }
  }

  async getSessionStatus(sessionId: string): Promise<{
    likes: number[];
    dislikes: number[];
  }> {
    const sessionKey = this.getSessionKey(sessionId);
    const sessionExists = await this.redis.exists(sessionKey);

    if (!sessionExists) {
      throw new NotFoundException('Session not found');
    }

    const users = await this.redis.smembers(sessionKey);
    if (users.length !== 2) {
      throw new BadRequestException('Invalid session');
    }

    const [user1, user2] = users;
    const user1Likes = this.getLikesKey(sessionId, user1);
    const user2Likes = this.getLikesKey(sessionId, user2);
    const user1Dislikes = this.getDislikesKey(sessionId, user1);
    const user2Dislikes = this.getDislikesKey(sessionId, user2);

    const [user1LikesList, user2LikesList, user1DislikesList, user2DislikesList] = await Promise.all([
      this.redis.smembers(user1Likes),
      this.redis.smembers(user2Likes),
      this.redis.smembers(user1Dislikes),
      this.redis.smembers(user2Dislikes),
    ]);

    return {
      likes: [...new Set([...user1LikesList, ...user2LikesList])].map(Number),
      dislikes: [...new Set([...user1DislikesList, ...user2DislikesList])].map(Number),
    };
  }
}
