import { extractShorthands } from '../shorthands';

describe('merge', () => {
  it.each([
    ['padding', '1px 2px 3px 4px'],
    ['padding', '1px 2px 3px'],
    ['padding', '1px 2px'],
    ['padding', '1px'],
    ['padding', 1],
    ['margin', '1px 2px 3px 4px'],
    ['margin', '1px 2px 3px'],
    ['margin', '1px 2px'],
    ['margin', '1px'],
    ['margin', 1],
  ])('expand circular %s with "%s" in given stylesheet', (name, value) => {
    const style = extractShorthands({
      [name]: value,
    });
    expect(style).toMatchSnapshot();
  });

  it.each([
    ['padding', { padding: '1px 2px' }, { paddingTop: '10px' }],
    ['margin', { margin: '1px 2px' }, { marginTop: '10px' }],
  ])('should override defined shorthands for %s', (name, prop1, prop2) => {
    const style = extractShorthands({ ...prop1, ...prop2 });
    expect(style).toMatchSnapshot();

    const styleReversed = extractShorthands({ ...prop2, ...prop1 });
    expect(styleReversed).toMatchSnapshot();

    expect(style).toEqual(styleReversed);
  });

  it('should expand flex', () => {
    expect(
      extractShorthands({
        flex: '0 1 auto',
      })
    ).toMatchSnapshot();

    expect(
      extractShorthands({
        flex: '1 1',
      })
    ).toMatchSnapshot();
  });

  it('should merge properties', () => {
    const style = extractShorthands({
      padding: '1px 2px',
      paddingLeft: '10px',
      paddingTop: 20,
    });
    expect(style).toMatchSnapshot();
  });

  it('should merge border properties', () => {
    const style = extractShorthands({
      border: '1px solid red',
      borderLeft: '10px dotted yellow',
      borderWidth: '20px 30px',
      borderLeftWidth: 5,
    });
    expect(style).toMatchSnapshot();
  });

  it('should merge flex', () => {
    const style = extractShorthands({
      flex: '0 1 auto',
      flexGrow: 1,
    });
    expect(style).toMatchSnapshot();
  });

  it('should preserve non shorthand properties', () => {
    const style = extractShorthands({
      padding: 1,
      color: 'red',
      foo: 'bar',
    });
    expect(style.color).toBe('red');
    expect(style.foo).toBe('bar');
  });

  it('should parse var', () => {
    const style = extractShorthands({
      padding: '10px var(--foo)',
    });
    expect(style).toMatchSnapshot();
  });

  it('should parse calc', () => {
    const style = extractShorthands({
      padding: 'calc(100% - 1px)',
    });
    expect(style).toMatchSnapshot();
  });

  it('should parse a mix of var and calc', () => {
    const style = extractShorthands({
      margin: 'calc(100% - var(--foo)) 10px',
    });
    expect(style).toMatchSnapshot();
  });
});
