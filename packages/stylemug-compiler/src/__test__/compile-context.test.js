import { compileSchema } from '../compile';

describe('compile', () => {
  it('should assert an invalid sheet', () => {
    const { result, reports } = compileSchema({
      default: {
        color: 'red',
        backgroundColor: 'yellow',
      },
      // The rule below fails.
      foo: 'bar',
    });

    expect(result).toMatchSnapshot();
    expect(reports).toMatchSnapshot();
  });

  it('should assert an invalid rule value', () => {
    const { reports } = compileSchema({
      default: {
        color: true,
      },
    });

    expect(reports).toMatchSnapshot();
  });

  it('should assert invalid pseudo classes', () => {
    const { reports } = compileSchema({
      default: {
        '&:iAmAnInvalidPseudoClass': {
          color: true,
        },
      },
    });

    expect(reports).toMatchSnapshot();
  });

  it('should report multiple errors', () => {
    const { reports } = compileSchema({
      foo: 'bar',
      default: {
        '&:iAmAnInvalidPseudoClass': {
          color: true,
        },
      },
    });

    expect(reports).toMatchSnapshot();
  });
});
