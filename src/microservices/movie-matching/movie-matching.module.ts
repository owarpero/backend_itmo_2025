import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import databaseConfig from '../../config/database.config';
import redisConfig from '../../config/redis.config';
import rabbitmqConfig from '../../config/rabbitmq.config';
import { RedisModule } from '../redis/redis.module';
import authConfig from '../../config/auth.config';

import { MovieMatch } from '../../entities/movie-match.entity';
import { MovieMatchingService } from './movie-matching.service';
import { MovieMatchingController } from './movie-matching.controller';
import { AuthModule } from '../../modules/auth/auth.module';
import { JwtStrategy } from '../../modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, rabbitmqConfig, authConfig],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        const cfg = cs.get('auth.jwt');
        return {
          secret: cfg.secret,
          signOptions: { expiresIn: cfg.expiresIn },
        };
      },
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => cs.get('database'),
    }),

    TypeOrmModule.forFeature([MovieMatch]),
    RedisModule,

    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => {
          const rmq = cs.get<{ uri: string; queues: Record<string, string> }>(
            'rabbitmq',
          );
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmq.uri],
              queue: rmq.queues.userService,
              queueOptions: { durable: true },
            },
          };
        },
      },
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => {
          const rmq = cs.get<{ uri: string; queues: Record<string, string> }>(
            'rabbitmq',
          );
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmq.uri],
              queue: rmq.queues.authService,
              queueOptions: { durable: true },
            },
          };
        },
      },
    ]),
  ],
  controllers: [MovieMatchingController],
  providers: [MovieMatchingService, JwtStrategy],
})
export class MovieMatchingModule {}
