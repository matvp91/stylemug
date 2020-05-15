import runtime from '../index';
import warn from '../warn';

jest.mock('../warn', () => jest.fn());

describe('runtime', () => {
  beforeEach(() => {
    warn.mockReset();
  });

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
  });

  describe('resolver warnings', () => {
    it('should warn when a lookup failed', () => {
      const styles = runtime.create({
        foo: {
          color: 'red',
        },
      });
      styles('unknown');

      expect(warn).toHaveBeenCalledWith(
        'The class name "unknown" does not exist in your stylesheet. Check your stylemug.create({}) definition.'
      );
    });
  });

  describe('compiler warnings', () => {
    it('should warn if a compiler error is thrown', () => {
      runtime.create(
        {
          mock: true,
        },
        'A compiler error occured'
      );

      expect(warn).toHaveBeenCalledWith('A compiler error occured');
    });
  });
});
