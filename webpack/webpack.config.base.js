const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackMerge = require('webpack-merge');

const { loadEnv, DotenvWebpackPlugin } = require('./plugins/dotenv-webpack-plugin');

loadEnv();

const isDev = process.env.NODE_ENV !== 'production';

const baseConfig = (isRenderer) => ({
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-source-map' : false,
  plugins: [new DotenvWebpackPlugin({ isWeb: isRenderer })],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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
