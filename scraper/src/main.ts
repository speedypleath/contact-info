import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const user = configService.get('RABBITMQ_USER');
  const pass = configService.get('RABBITMQ_PASSWORD');
  const host = configService.get('RABBITMQ_HOST');
  const url = 'amqp://' + user + ':' + pass + '@' + host + ':5672';

  const microserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: 'scrape_queue',
    },
  };

  app.connectMicroservice(microserviceOptions);

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
