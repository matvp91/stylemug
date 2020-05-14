const path = require('path');
const webpack = require('webpack');

const BuildScopes = {
  RUNTIME: 'runtime',
  COMPILER: 'compiler',
};

function runtimeConfig({ mode }) {
  const isProd = mode === 'production';
  const envSuffix = isProd ? 'prod' : 'dev';

  return {
    entry: './src/index.js',
    output: {
      libraryTarget: 'commonjs2',
      filename: `index.${envSuffix}.js`,
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
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProd),
      }),
    ],
  };
}

function compilerConfig() {
  return {
    entry: 'stylemug-compiler',
    target: 'node',
    output: {
      libraryTarget: 'commonjs2',
      filename: 'compiler.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
}

module.exports = (_, argv) => {
  const { scope, mode } = argv;
  if (scope === BuildScopes.RUNTIME) {
    return runtimeConfig({ mode });
  }
  if (scope === BuildScopes.COMPILER) {
    return compilerConfig({ mode });
  }
  throw new Error('Unknown scope.');
};
