const extractor = require('../extractor');

describe('extractor', () => {
  it('should generate basic css', () => {
    extractor.save('a', {
      key: 'color',
      value: 'red',
      children: '',
      media: null,
    });

    extractor.save('b', {
      key: 'color',
      value: 'blue',
      children: ':hover',
      media: null,
    });

    expect(extractor.flushAsCss()).toMatchSnapshot();
  });

  it('should hyphenate keys', () => {
    const rule = extractor.createRule('a', {
      key: 'fontSize',
      value: 16,
      children: '',
      media: null,
    });
    expect(rule).toBe('.a{font-size:16}');
  });
});
