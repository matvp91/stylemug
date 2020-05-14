const path = require('path');

module.exports = [
  {
    entry: './src/index.js',
    output: {
      libraryTarget: 'commonjs2',
      filename: 'runtime.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: 'babel-loader',
        },
      ],
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
