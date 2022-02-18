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
    extensions.errors = error.extensions.invalidArgs.map((invalidArg) => ({
      field: invalidArg.property,
      errors: invalidArg.constraints,
      hourError: invalidArg.children?.map((child) => ({
        field: child.children?.map((child) => ({
          field: child.children?.map((child) => ({
            field: child.constraints.isMilitaryTime,
          })),
        })),
      })),
    }));
    const graphQLFormattedError: GraphQLFormattedError = {
      message: 'BAD_USER_INPUT',
      extensions: extensions,
    };

    return graphQLFormattedError;
  } else {
    return error;
  }
}
