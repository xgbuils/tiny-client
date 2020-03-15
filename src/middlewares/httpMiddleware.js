const {print} = require('graphql');

const httpMiddleware = ({uri}) => async (operation, next) => {
  const rawQuery = print(operation.query);
  const response = await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({query: rawQuery}),
  })
  .then(res => res.json());
  return next({
    ...operation,
    response
  });
};

module.exports = httpMiddleware;
