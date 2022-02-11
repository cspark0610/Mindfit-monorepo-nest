import { Catch, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import {
  TypeORMError,
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
} from 'typeorm';

@Catch(TypeORMError)
export class TypeormExceptionFilter implements GqlExceptionFilter {
  catch(exception: TypeORMError) {
    switch (exception.constructor) {
      case QueryFailedError:
        throw new MindfitException({
          error: exception.message,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorCode: 'TYPEORM_QUERY_FAILED',
          extra: {
            typeormErrorCode: (exception as any).code,
          },
        });
      case EntityNotFoundError:
        throw new MindfitException({
          error: exception.message,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorCode: 'TYPEORM_ENTITY_NOT_FOUND',
          extra: {
            typeormErrorCode: (exception as any).code,
          },
        });
      case CannotCreateEntityIdMapError:
        throw new MindfitException({
          error: exception.message,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorCode: 'TYPEORM_CANNOT_CREATE_ENTITY_ID_MAP',
          extra: {
            typeormErrorCode: (exception as any).code,
          },
        });
      default:
        throw new MindfitException({
          error: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: 'INTERNAL_SERVER_ERROR',
        });
    }
  }
}
