const { extractor } = require('stylemug-compiler');
const { RawSource } = require('webpack-sources');

module.exports = class StylemPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('StylemugEmit', (compilation, cb) => {
      const css = extractor.flushAsCss();
      compilation.assets[this.options.name] = new RawSource(css);
      cb();
    });
  }
};
