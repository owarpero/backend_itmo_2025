import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  queues: {
    userService: 'user_service_queue',
    authService: 'auth_service_queue',
    movieMatchingService: 'movie_matching_service_queue',
  },
  exchanges: {
    userEvents: 'user_events',
    matchEvents: 'match_events',
    sessionEvents: 'session_events',
  },
  routingKeys: {
    userCreated: 'user.created',
    userUpdated: 'user.updated',
    matchCreated: 'match.created',
    sessionStarted: 'session.started',
    sessionEnded: 'session.ended',
  },
}));
