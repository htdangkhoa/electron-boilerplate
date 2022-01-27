const path = require('path');
const webpack = require('webpack');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { merge, cwd, isDev } = require('./webpack.config.base');

module.exports = merge(true, {
  // target: 'electron-renderer',
  entry: [path.resolve(cwd(), 'src/renderer/index.js'), 'react-refresh/runtime'],
  output: {
    path: path.resolve(cwd(), 'dist'),
    publicPath: isDev ? '/' : './',
    filename: '[name].[fullhash].js',
    chunkFilename: '[id].[contenthash].js',
  },
  plugins: [
    isDev && new webpack.HotModuleReplacementPlugin(),
    isDev && new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/renderer/index.html',
      hash: true,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/renderer/assets', to: 'assets' }],
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
        },
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            issuer: /\.jsx?$/,
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  icon: true,
                  exportType: 'named',
                  prettier: false,
                  svgo: false,
                  svgoConfig: {
                    plugins: [{ removeViewBox: false }],
                  },
                  titleProp: true,
                  ref: true,
                },
              },
              {
                loader: require.resolve('./loaders/url-loader'),
              },
            ],
          },
          {
            type: 'asset',
            generator: {
              publicPath: '/',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    // disableHostCheck: true,
    // historyApiFallback: true,
    // contentBase: 'dist',
    // contentBasePublicPath: '/',
    // hot: true,
    // writeToDisk: true,
    static: {
      directory: '/',
    },
    hot: true,
  },
});
