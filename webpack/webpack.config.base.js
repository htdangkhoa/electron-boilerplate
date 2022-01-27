const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackMerge = require('webpack-merge');

const { loadEnv, DotenvWebpackPlugin } = require('./plugins/dotenv-webpack-plugin');

loadEnv();

const isDev = process.env.NODE_ENV !== 'production';

const baseConfig = (isRenderer) => ({
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-source-map' : false,
  plugins: [
    new DotenvWebpackPlugin({ isWeb: isRenderer }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx'],
  },
  optimization: isDev
    ? undefined
    : {
        minimizer: [
          !isDev &&
            new TerserPlugin({
              extractComments: true,
              terserOptions: {
                ecma: 8,
                output: {
                  comments: false,
                },
              },
              parallel: true,
            }),
        ].filter(Boolean),
      },
});

module.exports = {
  merge(isRenderer, ...configs) {
    return WebpackMerge.merge(baseConfig(isRenderer), ...configs);
  },
  cwd() {
    return path.resolve(process.cwd());
  },
  isDev,
};
