const isObject = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Object'
}

const transform = (data, resolvers) => {
  if (Array.isArray(data)) {
    return data.map(item => transform(item, resolvers));
  } else if (isObject(data)) {
    const { __typename } = data;
    const result = transformObject(data, resolvers, __typename);
    result.__typename = __typename;
    return result;
  }
  return data;
}

const getFields = (typeResolver, data) => {
  return new Set([
    ...Object.getOwnPropertyNames(typeResolver),
    ...Object.keys(data),
  ]);
}

const transformObject = (data, resolvers, __typename) => {
  const typeResolver = resolvers[__typename] || {};
  const fields = getFields(typeResolver, data);
  const result = {};

  for (const field of fields) {
    const resolver = typeResolver[field];
    const newValue = resolver ? resolver(data) : data[field];
    result[field] = transform(newValue, resolvers)
  }

  return result;
} 

const clientResolversMiddleware = ({resolvers}) => (operation, next) => {
  return next({
    ...operation,
    response: {
      data: transformObject(operation.response.data, resolvers, 'Query'),
    },
  })
}

module.exports = clientResolversMiddleware;
