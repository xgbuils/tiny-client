const {print} = require('graphql')

const TinyClient = ({ uri }) => {
  const cache = new Map();
  return {
    query({query}) {
      const rawQuery = print(query);
      if (!cache.has(rawQuery)) {
        const responsePromise = fetch(uri, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({query: rawQuery}),
        })
        .then(res => res.json());
        cache.set(rawQuery, responsePromise);
      }
      return cache.get(rawQuery);
    }
  };
};

module.exports = TinyClient;