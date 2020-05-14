const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const stylemugCompiler = require('stylemug-compiler');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [stylemugCompiler.babel],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      // Directly import the runtime during development.
      stylemug: 'stylemug/src',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
    new stylemugCompiler.webpack({
      name: 'bundle.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],
};
