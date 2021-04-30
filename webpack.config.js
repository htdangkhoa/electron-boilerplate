const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    renderer: path.resolve(process.cwd(), 'src/renderer/index.js'),
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    filename: '[name].[fullhash].js',
    chunkFilename: '[id].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'static/index.html',
      hash: true,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/renderer/assets', to: 'assets' }],
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    contentBase: 'dist',
    contentBasePublicPath: '/',
    // writeToDisk: true,
    // host: '0.0.0.0',
  },
};
