const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const stylemugBabelPlugin = require('stylemug/compiler');

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
            plugins: [stylemugBabelPlugin.babel],
          },
        },
      },
    ],
  },
  plugins: [
    new stylemugBabelPlugin.webpack({
      name: 'bundle.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],
};
