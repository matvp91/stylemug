const path = require('path');

module.exports = [
  {
    entry: './src/index.js',
    output: {
      filename: 'runtime.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
  {
    entry: 'stylemug-compiler',
    target: 'node',
    output: {
      library: 'stylemugCompiler',
      libraryTarget: 'commonjs2',
      filename: 'compiler.js',
      path: __dirname,
    },
  },
];
