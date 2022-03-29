import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';

export const validateAuthSubscriptions = (connectionParams) => {
  if (
    connectionParams &&
    !connectionParams.Authorization &&
    !connectionParams.authorization
  )
    throw new MindfitException({
      error: 'Invalid Session',
      errorCode: 'INVALID_SESSION',
      statusCode: HttpStatus.UNAUTHORIZED,
    });

  return {
    connection: {
      headers: {
        authorization:
          connectionParams.Authorization || connectionParams.authorization,
      },
    },
  };
};
