import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieMatchingService } from '../movie-matching.service';
import { MovieMatch } from '../entities/movie-match.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { jest } from '@jest/globals';

describe('MovieMatchingService', () => {
  let service: MovieMatchingService;
  let redisClient: jest.Mocked<Redis>;

  const redisMock = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn().mockImplementation(() => Promise.resolve(1)),
    multi: jest.fn().mockReturnThis(),
    rpush: jest.fn().mockReturnThis(),
    exec: jest.fn().mockImplementation(() => Promise.resolve([])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieMatchingService,
        {
          provide: 'REDIS_CLIENT',
          useValue: redisMock,
        },
        {
          provide: getRepositoryToken(MovieMatch),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MovieMatchingService>(MovieMatchingService);
    redisClient = module.get('REDIS_CLIENT');
  });

  describe('createSession', () => {
    it('should create a new session successfully', async () => {
      const dto = { user1_id: 'user1', user2_id: 'user2' };
      const result = await service.createSession(dto);
      expect(result).toBeDefined();
      expect(redisClient.multi).toHaveBeenCalled();
      expect(redisClient.exec).toHaveBeenCalled();
    });

    it('should throw BadRequestException when users are the same', async () => {
      const dto = { user1_id: 'user1', user2_id: 'user1' };
      await expect(service.createSession(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('addMoviesToQueue', () => {
    it('should add movies to queue when session exists', async () => {
      redisClient.exists.mockResolvedValue(1);
      await service.addMoviesToQueue('session1', [1, 2, 3]);
      expect(redisClient.multi).toHaveBeenCalled();
      expect(redisClient.rpush).toHaveBeenCalled();
    });

    it('should throw NotFoundException when session does not exist', async () => {
      redisClient.exists.mockResolvedValue(0);
      await expect(
        service.addMoviesToQueue('session1', [1, 2, 3]),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
