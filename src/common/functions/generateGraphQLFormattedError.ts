import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { HttpStatus } from '@nestjs/common';

export function generateGraphQLFormattedError(
  error: GraphQLError,
): GraphQLFormattedError | GraphQLError {
  if (error.message === 'BAD_USER_INPUT') {
    const extensions = {
      statusCode: HttpStatus.BAD_REQUEST,
      errors: [],
    };

    Object.keys(error.extensions.invalidArgs).forEach((key) => {
      const constraints = [];
      Object.keys(error.extensions.invalidArgs[key].constraints).forEach(
        (_key) => {
          constraints.push(error.extensions.invalidArgs[key].constraints[_key]);
        },
      );

      extensions.errors.push({
        field: error.extensions.invalidArgs[key].property,
        errors: constraints,
      });
    });

    const graphQLFormattedError: GraphQLFormattedError = {
      message: 'BAD_USER_INPUT',
      extensions: extensions,
    };

    return graphQLFormattedError;
  } else {
    return error;
  }
}
