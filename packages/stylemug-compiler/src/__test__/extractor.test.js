import { flushAsCss, createRule, save } from '../extractor';

describe('extractor', () => {
  it('should generate basic css', () => {
    save('a', {
      key: 'color',
      value: 'red',
      children: '',
      media: null,
    });

    save('b', {
      key: 'color',
      value: 'blue',
      children: ':hover',
      media: null,
    });

    expect(flushAsCss()).toMatchSnapshot();
  });

  it('should hyphenate keys', () => {
    const rule = createRule('a', {
      key: 'fontSize',
      value: 16,
      children: '',
      media: null,
    });
    expect(rule).toBe('.a{font-size:16}');
  });
});
