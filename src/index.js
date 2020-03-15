const gql = require('graphql-tag');

const util = require('util');
const debug = (obj) => {
  console.log(util.inspect(obj, {showHidden: false, depth: null}))
};
const compose = require('./middlewares/compose');
const cacheMiddleware = require('./middlewares/cacheMiddleware');
const httpMiddleware = require('./middlewares/httpMiddleware');
const addTypenameMiddleware = require('./middlewares/addTypenameMiddleware');
const clientResolversMiddleware = require('./middlewares/clientResolversMiddleware');

const TinyClient = require('./TinyClient');

global.fetch = require('node-fetch');
const createExecutableSchema = require('./createExecutableSchema');
const MockedClient = require('./MockedClient');

const introspectionResult = require("../schema.json");

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      ...CountryInfo
    }
  }

  fragment CountryInfo on Country {
    code
    name
    states {
      ...StateInfo
    }
  }

  fragment StateInfo on State {
    code
    name
  }
`;

const tinyClient = TinyClient({
  middleware: compose(
    cacheMiddleware(),
    addTypenameMiddleware,
    httpMiddleware({
      uri: 'https://countries.trevorblades.com/',
    }),
    clientResolversMiddleware({
      resolvers: {
        Country: {
          codeAndName({code, name}) {
            return `${code} ${name}`;
          }
        },
        State: {
          other() {
            return 'extra'
          }
        }
      }
    })
  )
});

tinyClient.query({
  query: GET_COUNTRIES
})
.then((result) => debug(result));




