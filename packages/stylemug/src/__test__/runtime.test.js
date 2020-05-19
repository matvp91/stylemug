import runtime from '../index';

describe('runtime', () => {
  describe('resolver', () => {
    let styles;

    beforeEach(() => {
      styles = runtime.create({
        foo: {
          key1: 'className1',
          key2: 'className2',
        },
        bar: {
          key1: 'className3',
        },
      });
    });

    it('should resolve multiple class names', () => {
      const classNames = styles('foo', 'bar');
      expect(classNames).toBe('className3 className2');
    });

    it('should resolve falsy lookups (first arg)', () => {
      const classNames = styles(false && 'foo', 'bar');
      expect(classNames).toBe('className3');
    });

    it('should resolve falsy lookups (second arg)', () => {
      const classNames = styles('foo', false && 'bar');
      expect(classNames).toBe('className1 className2');
    });

    it('should expose classnames as properties on resolver', () => {
      expect([styles.foo, styles.bar]).toMatchSnapshot();
    });
  });
});
