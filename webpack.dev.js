/**
 * Dev webpack config
 * @desc Exports dev config to be merged with common config
 * https://webpack.js.org/configuration/mode/ to see details
 * @param {mode} development
 */

const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
});
