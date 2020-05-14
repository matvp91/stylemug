import runtime from '../index';

describe('runtime', () => {
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

  describe('warnings', () => {
    beforeEach(() => {
      global.console.warn = jest.fn();
    });

    it('should warn when a lookup failed', () => {
      const spy = jest.spyOn(console, 'warn');
      const classNames = styles('unknown');

      expect(spy).toHaveBeenCalledWith(
        '[stylemug] The class name "unknown" does not exist in your stylesheet. Check your stylemug.create({}) definition.'
      );

      spy.mockRestore();
    });
  });
});
