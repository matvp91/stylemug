const compile = require('../compile');

describe('compile', () => {
  it('should compile schema', () => {
    const result = compile.compileSchema({
      default: {
        color: 'red',
        backgroundColor: 'yellow',
      },
      foo: {
        color: 'blue',
      },
      bar: {
        color: 'red',
      },
    });

    expect(result).toMatchSnapshot();
  });

  it('should compile nested selectors', () => {
    const result = compile.compileSchema({
      default: {
        color: 'red',

        '&:focus': {
          color: 'blue',
        },
      },
    });

    expect(result).toMatchSnapshot();
  });

  it('should compile nested media query', () => {
    const result = compile.compileSchema({
      default: {
        color: 'red',

        '@media only screen and (max-width: 600px)': {
          color: 'blue',
        },
      },
    });

    expect(result).toMatchSnapshot();
  });
});
