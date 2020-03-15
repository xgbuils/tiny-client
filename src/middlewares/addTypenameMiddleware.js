const TYPENAME_FIELD = {
  kind: 'Field',
  name: {
    kind: 'Name',
    value: '__typename',
  },
};

function addTypenameMiddleware (operation, next) {
  return next({
    ...operation,
    query: addTypenameToDocument(operation.query),
  })
}

function addTypenameToDocument(doc) {
  return {
    ...doc,
    definitions: doc.definitions.map(definition => {
      return {
        ...definition,
        selectionSet: addTypenameToSelectionSet(
          definition.selectionSet,
          true,
        )
      };
    }),
  };
}

function addTypenameToSelectionSet(
  selectionSet,
  isRoot = false,
) {
  if (!selectionSet.selections) {
    return selectionSet;
  }

  return {
    ...selectionSet,
    selections: addTypenameToSelectionList(selectionSet.selections, isRoot),
  };
}

function addTypenameToSelectionList(selections, isRoot = false) {
  const transformedSelections = selections
    .map(selection => addTypenameToSelection(selection));

  if (!isRoot) {
    const alreadyHasThisField = selections
      .some(selection => (
        selection.kind === 'Field' &&
        selection.name.value === '__typename'
      ));

    if (!alreadyHasThisField) {
      transformedSelections.push(TYPENAME_FIELD);
    }
  }
  return transformedSelections;
}

function addTypenameToSelection (selection) {
  let selectionSet;
  if (selection.selectionSet) {
    if (selection.kind === 'Field' && selection.name.value.lastIndexOf('__', 0) !== 0) {
      selectionSet = addTypenameToSelectionSet(selection.selectionSet)
    } else if (selection.kind === 'InlineFragment') {
      selectionSet = addTypenameToSelectionSet(selection.selectionSet)
    }
  }
  return selectionSet ? {
    ...selection,
    selectionSet
  } : selection;
}

module.exports = addTypenameMiddleware;
