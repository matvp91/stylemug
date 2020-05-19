import warn from './warn';

export default {
  create(schema, error) {
    if (__DEV__ && error) {
      warn(error);
    }

    const resolver = (...classNames) => {
      const maps = [{}];

      const len = classNames.length;
      for (let i = 0; i < len; i++) {
        const className = classNames[i];
        if (!className) {
          continue;
        }
        if (typeof className === 'object') {
          maps.push(className);
        }
        if (typeof className === 'string') {
          maps.push(schema[className]);
        }
      }

      return Object.values(Object.assign.apply(null, maps)).join(' ');
    };

    for (let key in schema) {
      resolver[key] = schema[key];
    }

    return resolver;
  },
};
