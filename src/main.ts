import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from 'src/app.module';
import { TypeormExceptionFilter } from 'src/common/filters/typeormException.filter';
import { UserInputError } from 'apollo-server-errors';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]): any => {
        return new UserInputError('BAD_USER_INPUT', {
          invalidArgs: errors,
        });
      },
    }),
  );
  app.useGlobalFilters(new TypeormExceptionFilter());
  await app.listen(process.env.PORT || 5000, '0.0.0.0');
}
bootstrap();
