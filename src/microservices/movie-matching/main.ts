import { NestFactory } from '@nestjs/core';
import { MovieMatchingModule } from './movie-matching.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(MovieMatchingModule);
  const configService = app.get(ConfigService);

  // Configure microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('rabbitmq.url', 'amqp://localhost:5672'),
      ],
      queue: configService.get<string>(
        'rabbitmq.queues.movieMatchingService',
        'movie_matching_queue',
      ),
      queueOptions: {
        durable: true,
      },
    },
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Movie Matching Service')
    .setDescription('The movie matching microservice API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start microservice and HTTP server
  await app.startAllMicroservices();
  await app.listen(configService.get('MOVIE_MATCHING_SERVICE_PORT', 3001));
}
bootstrap();
