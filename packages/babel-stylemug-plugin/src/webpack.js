import { extractCss } from 'stylemug-compiler';
import { RawSource } from 'webpack-sources';

export class StylemugPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('StylemugEmit', (compilation, cb) => {
      const css = extractCss();
      compilation.assets[this.options.name] = new RawSource(css);
      cb();
    });
  }
}
