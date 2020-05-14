const babel = require('@babel/core');
const plugin = require('../babel');

jest.mock('../compile', () => ({
  compileSchema: () => ({
    className: {
      hash: {
        keyId: 'id',
      },
    },
  }),
}));

describe('babel plugin', () => {
  it('should replace create argument', () => {
    const example = `
      import stylemug from 'stylemug';

      const styles = stylemug.create({
        default: {
          color: 'red',
        },
      });
    `;

    const { code } = babel.transform(example, {
      plugins: [plugin],
    });

    expect(code).toMatchSnapshot();
  });
});
