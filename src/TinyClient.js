const util = require('util');
const debug = (obj) => {
  console.log(util.inspect(obj, {showHidden: false, depth: null}))
};

const TinyClient = ({ middleware }) => ({
  query(operation) {
    debug(operation.query);
    return middleware(operation, async (op) => await op)
      .then(({response}) => response);
  }
});

module.exports = TinyClient;