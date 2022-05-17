import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getRelationsFromQuery } from 'src/common/functions/getRelationsFromQuery';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

export const QueryRelations = createParamDecorator(
  (model: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const rootSelections = ctx.getInfo().fieldNodes[0].selectionSet.selections;

    const relations: QueryRelationsType = {
      ref: model.toLowerCase(),
      relations: [],
    };

    rootSelections.map((selection) =>
      getRelationsFromQuery({
        selection,
        relations: relations.relations,
        parent: model.toLowerCase(),
      }),
    );

    return relations;
  },
);
