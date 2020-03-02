const { makeExecutableSchema, addMockFunctionsToSchema } = require("graphql-tools");
const {
  printSchema,
  buildClientSchema,
} = require('graphql');

function createSchema({ schema, mocks }) {
  const schemaSDL = printSchema(
    buildClientSchema({ __schema: schema })
  );

  const executableSchema = makeExecutableSchema({
    typeDefs: schemaSDL,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    }
  });

  addMockFunctionsToSchema({ 
    schema: executableSchema,
    mocks
  });

  return executableSchema;
}

module.exports = createSchema;