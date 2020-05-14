const path = require('path');

module.exports = [
  {
    entry: './src/index.js',
    output: {
      libraryTarget: 'commonjs2',
      filename: 'runtime.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
  {
    entry: 'stylemug-compiler',
    target: 'node',
    output: {
      libraryTarget: 'commonjs2',
      filename: 'compiler.js',
      path: __dirname,
    },
  },
];
