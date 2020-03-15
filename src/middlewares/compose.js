const compose2 = (m1, m2) => (operation, next) => 
  m1(operation, (op) =>  m2(op, next));

const compose = (...middlewares) => middlewares.reduce(compose2);

module.exports = compose;
