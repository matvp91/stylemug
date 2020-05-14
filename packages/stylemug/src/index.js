export default {
  create(schema) {
    const resolver = (...classNames) => {
      return Object.values(
        Object.assign(
          {},
          ...classNames.map((className) => {
            // When composed from elsewhere, it'll contain the rules directly,
            // as the result of resolver.className.
            if (typeof className === 'object') {
              return className;
            }
            return schema[className];
          })
        )
      ).join(' ');
    };

    for (let key in schema) {
      resolver[key] = schema[key];
    }

    return resolver;
  },
};
