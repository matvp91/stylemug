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
    expect(classNames).toBe('className1 className3');
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