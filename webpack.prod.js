/**
 * Dev webpack config
 * @desc Exports dev config to be merged with common config
 * https://webpack.js.org/configuration/mode/ to see details
 * @param {mode} production
 * https://webpack.js.org/configuration/optimization/ for optimization details
 * Terser is used to minify JS
 */

const TerserJSPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        test: /\.(js|js.liquid)?$/,
      }),
    ],
  },
});
