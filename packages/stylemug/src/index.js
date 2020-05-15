import warn from './warn';

const noop = () => {};

export default {
  create(schema, error) {
    if (error) {
      if (__DEV__) {
        warn(error);
      }
      return noop;
    }

    const resolver = (...classNames) => {
      const maps = [{}];

      const len = classNames.length;
      for (let i = 0; i < len; i++) {
        const className = classNames[i];
        if (!className) {
          continue;
        }

        const type = typeof className;

        if (type === 'object') {
          maps.push(className);
        }
        if (type === 'string') {
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

      return Object.values(Object.assign(...maps)).join(' ');
    };

    for (let key in schema) {
      resolver[key] = schema[key];
    }

    return resolver;
  },
};
