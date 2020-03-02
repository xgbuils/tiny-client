const gql = require('graphql-tag');

const util = require('util');
const debug = (obj) => {
  console.log(util.inspect(obj, {showHidden: false, depth: null}))
};

const TinyClient = require('./TinyClient');

global.fetch = require('node-fetch');
const createExecutableSchema = require('./createExecutableSchema');
const MockedClient = require('./MockedClient');

const introspectionResult = require("../schema.json");

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
    }
  }
`;

const schema = createExecutableSchema({
  schema: introspectionResult.__schema
});
const mockedClient = MockedClient({ schema });
mockedClient.query({
  query: GET_COUNTRIES
})
.then((result) => debug(result));

const tinyClient = TinyClient({
  uri: 'https://countries.trevorblades.com/',
});
tinyClient.query({
  query: GET_COUNTRIES
})
.then((result) => debug(result));




