/**
 * PostCSS
 * @desc How CSS will be processed. See webpack.common.js file to see where postcss-loader is
 * being used.
 * Autoprefixer = Adds vendor prefixers https://github.com/postcss/autoprefixer
 * postcssPresentEnv = Use modern CSS and include fallbacks https://preset-env.cssdb.org/features#stage-3
 */

const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    autoprefixer(),
    postcssPresetEnv({ stage: 3, browsers: 'last 10 versions' }),
  ],
};
