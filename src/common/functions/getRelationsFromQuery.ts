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
    relations.push([
      `${parent !== '' ? `${parent}.` : ''}${selection.name.value}`,
      selection.name.value,
    ]);

    selection.selectionSet.selections.forEach((subSelection) =>
      getRelationsFromQuery({
        selection: subSelection,
        relations,
        parent: selection.name.value,
      }),
    );
  }
};
