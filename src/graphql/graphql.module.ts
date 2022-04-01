import { Module } from '@nestjs/common';
import { GraphQLModule as BaseGraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { generateGraphQLFormattedError } from 'src/common/functions/generateGraphQLFormattedError';
import { validateAuthSubscriptions } from 'src/graphql/helpers/validateAuthSubscriptions';

@Module({
  imports: [
    BaseGraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      subscriptions: {
        'graphql-ws': {
          onConnect: ({ connectionParams }) =>
            validateAuthSubscriptions(connectionParams),
        },
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) =>
            validateAuthSubscriptions(connectionParams),
        },
      },
      context: (context) => {
        const { connectionParams } = context;
        if (!connectionParams) return context;

        return validateAuthSubscriptions(connectionParams);
      },
      formatError: (error: GraphQLError) =>
        generateGraphQLFormattedError(error),
    }),
  ],
  exports: [BaseGraphQLModule],
})
export class GraphQLModule {}
