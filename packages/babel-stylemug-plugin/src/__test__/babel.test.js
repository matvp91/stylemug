import { transform } from '@babel/core';
import { compileSchema } from 'stylemug-compiler';
import { babelPlugin as plugin } from '../babel';

jest.mock('stylemug-compiler', () => ({
  compileSchema: jest.fn(),
}));

describe('babel plugin', () => {
  beforeEach(() => {
    compileSchema.mockImplementationOnce(() => ({
      result: {
        className: {
          hash: {
            keyId: 'id',
          },
        },
      },
      reports: [],
    }));
  });

  it('should replace create argument', () => {
    const example = `
      import stylemug from 'stylemug';

      const styles = stylemug.create({
        default: {
          color: 'red',
        },
      });
    `;

    const { code } = transform(example, {
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

    const { code } = transform(example, {
      plugins: [plugin],
    });

    expect(code).toMatchSnapshot();
  });

  it('should replace create argument multiple times in the same file', () => {
    const example = `
      import stylemug from 'stylemug';

      const styles1 = stylemug.create({
        default: {
          color: 'red',
        },
      });

      const styles2 = stylemug.create({
        default: {
          color: 'blue',
        },
      });
    `;

    const { code } = transform(example, {
      plugins: [plugin],
    });

    expect(code).toMatchSnapshot();
  });
});

describe('babel plugin - reports', () => {
  it('should replace create argument', () => {
    compileSchema.mockImplementationOnce(() => ({
      result: {},
      reports: [{ message: 'mockError1' }, { message: 'mockError2' }],
    }));

    const example = `
      import stylemug from 'stylemug';

      const styles = stylemug.create({});
    `;

    const { code } = transform(example, {
      plugins: [plugin],
    });

    expect(code).toMatchSnapshot();
  });
});
