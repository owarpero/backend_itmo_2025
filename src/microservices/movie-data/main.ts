import { NestFactory } from '@nestjs/core';
import { MovieDataModule } from './movie-data.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(MovieDataModule, {
    logger: ['error', 'warn'],
  });

  const configService = app.get(ConfigService);

  // Configure microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672'),
      ],
      queue: 'movie_data_queue',
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
    .setTitle('Movie Data Service')
    .setDescription('The movie data microservice API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start microservice and HTTP server
  await app.startAllMicroservices();
  await app.listen(configService.get('MOVIE_DATA_SERVICE_PORT', 3004));
}
bootstrap();
