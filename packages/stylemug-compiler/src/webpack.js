const extractor = require('./extractor');
const { RawSource } = require('webpack-sources');

module.exports = class StylemPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      const css = extractor.flushAsCss();
      compilation.assets[this.options.name] = new RawSource(css);
      cb();
    });
  }
};
