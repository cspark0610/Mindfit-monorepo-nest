import { ExcludedFieldsFromRelations } from '../utils/excludedFieldsFromRelations';

export const getRelationsFromQuery = ({
  selection,
  relations = [],
  parent = '',
}: {
  selection: any;
  relations?: Array<Array<string>>;
  parent?: string;
}) => {
  if (selection.selectionSet) {
    const refName = `${parent}${selection.name.value[0].toUpperCase()}${selection.name.value.slice(
      1,
    )}`;

    if (!ExcludedFieldsFromRelations.includes(refName)) {
      relations.push([
        `${parent !== '' ? `${parent}.` : ''}${selection.name.value}`,
        refName,
      ]);

      selection.selectionSet.selections.forEach((subSelection) =>
        getRelationsFromQuery({
          selection: subSelection,
          relations,
          parent: selection.name.value,
        }),
      );
    }
  }
};
