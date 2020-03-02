const { execute } = require('graphql/execution/execute');

const MockedClient = ({schema}) => ({
  query(options) {
    return Promise.resolve(
      execute(
        schema,
        options.query,
        undefined,
        undefined,
        options.variables,
        options.operationName,
      )
    );
  }
})

module.exports = MockedClient;