/**
 * Theme commands
 * @desc List of commands used to build, compile, watch, and deploy. Executes webpack
 */

import chalk from 'chalk';
import { ensureDir } from 'fs-extra';

const path = require('path');

const { log } = console;
const webpack = require('webpack');
const themeKit = require('@shopify/themekit');
const production = require('../../webpack.prod');
const development = require('../../webpack.dev');

const prodCompiler = webpack(production);
const devCompiler = webpack(development);

const PATHS = {
  output: path.resolve(__dirname, '../../dist'),
};


/**
 * Compile command via Webpack
 * @desc Compiles with production environment for webpack
 * @func Checks for errors or warnings before building.
 * @returns Pass or Fail. On pass - build files are generated.
 */
export const compile = async () => {
  await new Promise((resolve, reject) => {
    prodCompiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        reject(err);
        return;
      }
      if (stats.hasErrors()) {
        log(stats.toJson().errors);
        log(chalk.bgHex('#fdcb6e').black('[WARNING: BUILD FAILED]'));
        reject(err);
        return;
      }

      if (stats.hasWarnings()) {
        log(stats.toJson().warnings);
        log(chalk.bgHex('#fdcb6e').black('[WARNING: BUILD FAILED]'));
        reject(err);
        return;
      }

      resolve('done');
      log(chalk.bgHex('#00b894').white('[Build successful]'));
      return
    });
  });
};

/**
 * Watch command via Webpack
 * @desc Watches with development environment for webpack
 * Aggregate timeout, waits for multiple saves before rebuild (set to 1000ms)
 * @func Checks for errors or warnings before building.
 * @returns Pass or Fail. On pass - build files are generated.
 */
export const watchCompile = () => {
  devCompiler.watch({
    aggregateTimeout: 1000,
  }, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return err;
    }

    if (stats.hasErrors()) {
      log(stats.toJson().errors);
      log(chalk.bgHex('#fdcb6e').black('[WARNING: BUILD FAILED]'));
      return;
    }

    if (stats.hasWarnings()) {
      log(stats.toJson().warnings);
      log(chalk.bgHex('#fdcb6e').black('[WARNING: BUILD FAILED]'));
      return;
    }

    log(stats.toString({
      chunks: false,
      cached: false,
      children: false,
      modules: false,
      colors: true,
    }));
    log(chalk.bgHex('#563ce7').white('[Finished building bundles. Uploading...]'));
    return stats;
  });
};

/**
 * Ensure dist exists command
 * @desc If no dist folder is found create one
 */
export const makeDir = () => {
  ensureDir(PATHS.output);
};

/**
 * Watch command via Themekit
 * @desc Establish connection with Shopify store via Watch
 * @func Checks for errors or warnings before building.
 * @returns Pass or Fail. On pass - build files are generated.
 */
export const watch = () => {
  themeKit
    .command('watch', {
      env: 'theme',
      dir: PATHS.output,
    })
    .catch((err) => {
      console.error('Error', err);
    });
};

/**
 * Open command via Themekit
 * @desc Open Shopify Store
 */
export const open = () => {
  themeKit
    .command('open', {
      env: 'theme',
    })
    .catch((err) => {
      console.error('Error', err);
    });
};

/**
 * Download command via Themekit
 * @desc Downloads Shopify store into SRC directory
 */
export const download = () => {
  themeKit
    .command('download', {
      env: 'theme',
      dir: `${PATHS.src}`,
    })
    .catch((err) => {
      console.error('Error', err);
    });
};

/**
 * Deploy command via Themekit
 * @desc Deploys to Shopify Store then opens store
 */
export const deploy = () => {
  log(chalk.bgHex('#563ce7').white('[Starting deployment process...]'));
  log(chalk.bgHex('#fdcb6e').black('[WARNING: STOPPING THE DEPLOYMENT PROCESS CAN RESULT IN FILE LOSS]'));
  themeKit
    .command('deploy', {
      env: 'theme',
      dir: `${PATHS.output}`,
    })
    .then(() => {
      log(chalk.bgHex('#00b894').white('[Deployment successful]'));
      open();
    })
    .catch((err) => {
      console.error('Error', err);
    });
};
