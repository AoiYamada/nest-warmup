import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // TODO: investigate options and move to config file
    // FYI: https://github.com/expressjs/cors#configuration-options
    cors: true,
  });
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      // TODO: investigate options and move to config file
      // TODO: investigate ParseArrayPipe to validate array input
      // disableErrorMessages: true,
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(configService.get('app.port'));
}
bootstrap();
