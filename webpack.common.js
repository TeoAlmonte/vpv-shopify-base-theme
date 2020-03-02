/**
 * Common webpack config
 * @desc Shared webpack config between Development and Production
 * Path = node package for accessing local paths
 * Glob = similar to regex
 * MiniCssExtractPlugin = extract css from js files https://webpack.js.org/plugins/mini-css-extract-plugin/
 * Chalk = Visual console.logs
 */

const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const chalk = require('chalk');

/**
  * Destructuring assignment for console.log
*/
const { log } = console;

/**
  * Define input and output paths
*/
const PATHS = {
  src: path.resolve(__dirname, './src'),
  output: path.resolve(__dirname, './dist'),
};

/**
  * Logs message
*/
log(chalk.bgHex('#563ce7').white('[Building bundles...]'));

/**
 * Merged settings
 * @desc Visit https://webpack.js.org/configuration/ for full list of options
 * Entry = which files are processed by webpack.
 * Output = Use [name] to dynamically pass filename
 * Optimization = Automatically create a bundled file named when a minimum of 2 chunks
 * are shared between files. Also known as file splitting. Vendors file automatically created from
 * node_module imports. These files should be the core external files used across the site.
 * Plugins = Extendable options defined here. See more popular plugins https://webpack.js.org/plugins/
 * Module = Determine rules of how files will be processed and in what order functions will
 * be applied to them.
*/
module.exports = {
  entry: glob.sync(`${PATHS.src}/assets/scripts/pages/*.js`)
    .reduce((x, y) => Object.assign(x, {
      [y.split('/').reverse()[0].split('.')[0]]: y,
    }), {}),
  output: {
    filename: '[name].bundle.js.liquid',
    path: `${PATHS.output}/assets`,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        theme: {
          name: 'theme',
          chunks: 'all',
          minChunks: 2,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          filename: '[name].bundle.js',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].scss.liquid',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3,
              }],
            ],
          },
        },
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                { search: "'{{", replace: '{{' },
                { search: "}}'", replace: '}}' },
              ],
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
