const deepEqual = require('fast-deep-equal');

const cacheMiddleware = () => {
  let cache = new Map();
  return (operation, next) => {
    const cachedOperation = cache.get(operation.query);
    if (cachedOperation && deepEqual(cachedOperation.variables, operation.variables)) {
      return cachedOperation;
    }
    const nextOperation = next(operation);
    cache.set(operation.query, nextOperation)
    return nextOperation;
  };
};

module.exports = cacheMiddleware;
