const babel = require('@babel/core');
const plugin = require('../babel');

jest.mock('stylemug-compiler', () => ({
  compile: {
    compileSchema: () => ({
      className: {
        hash: {
          keyId: 'id',
        },
      },
    }),
  },
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

  it('should error when failed to resolve', () => {
    const example = `
      import stylemug from 'stylemug';
      import { selector } from './mock';

      const styles = stylemug.create({
        [selector]: {
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
