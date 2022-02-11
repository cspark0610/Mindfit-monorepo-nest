import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from 'src/app.module';
import { TypeormExceptionFilter } from 'src/common/filters/typeormException.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new TypeormExceptionFilter());
  await app.listen(process.env.PORT || 5000, '0.0.0.0');
}
bootstrap();
