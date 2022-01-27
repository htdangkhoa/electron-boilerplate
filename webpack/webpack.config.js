const path = require('path');
const { merge, cwd, isDev } = require('./webpack.config.base');
const SpawnWebpackPlugin = require('./plugins/spawn-webpack-plugin');

module.exports = merge(false, {
  target: 'electron-main',
  watch: isDev,
  entry: [path.resolve(cwd(), 'src/main/index.js')],
  output: {
    path: path.join(cwd(), 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [new SpawnWebpackPlugin('npm', ['start'], { dev: isDev })],
});
