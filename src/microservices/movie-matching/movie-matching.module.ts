import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MovieMatch } from './entities/movie-match.entity';
import { MovieMatchingController } from './movie-matching.controller';
import { MovieMatchingService } from './movie-matching.service';
import { RedisModule } from '../redis/redis.module';
import rabbitmqConfig from '../../config/rabbitmq.config';
import databaseConfig from '../../config/database.config';
import redisConfig from '../../config/redis.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig, databaseConfig, redisConfig],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [MovieMatch],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),

    // Entity
    TypeOrmModule.forFeature([MovieMatch]),

    // Redis
    RedisModule,

    // RabbitMQ Clients
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('rabbitmq.url');
          const queue = configService.get<string>(
            'rabbitmq.queues.userService',
          );

          if (!url || !queue) {
            throw new Error('RabbitMQ configuration is incomplete');
          }

          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue,
              queueOptions: {
                durable: true,
              },
            },
          };
        },
      },
      {
        name: 'AUTH_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('rabbitmq.url');
          const queue = configService.get<string>(
            'rabbitmq.queues.authService',
          );

          if (!url || !queue) {
            throw new Error('RabbitMQ configuration is incomplete');
          }

          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue,
              queueOptions: {
                durable: true,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [MovieMatchingController],
  providers: [MovieMatchingService],
})
export class MovieMatchingModule {}
