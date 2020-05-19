import warn from './warn';

export default {
  create(schema, error) {
    if (error) {
      if (__DEV__) {
        warn(error);
      }
      return () => 'stylemug-error';
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
          if (__DEV__ && !schema[className]) {
            warn(
              'The class name "' +
                className +
                '" does not exist in your stylesheet. Check your ' +
                'stylemug.create({}) definition.'
            );
          }
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
