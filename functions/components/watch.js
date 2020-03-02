/**
 * Watch function for non-webpack processed files
 * @desc Files not processed by webpack will be piped with Chokidar
 */

import { copy } from 'fs-extra';
import fs from 'fs';
import path from 'path';
import slash from 'slash';
import glob from 'glob';
import chalk from 'chalk';
import chokidar from 'chokidar';

const { log } = console;

/**
  @desc Define input and output paths
*/
const PATHS = {
  src: path.resolve(__dirname, '../../src'),
  output: path.resolve(__dirname, '../../dist'),
};

const fetchSubDirectories = (callback) => {
  glob(`${PATHS.src}/!(assets)*/!(customers)*/*.liquid`, callback);
};

/**
 * Copy files
 * @desc Copy files to dist folder and flattens subfolders
 */
const copyFile = (output, filePath) => {
  fetchSubDirectories((err, res) => {
    const file = res.filter((files) => files.includes(filePath));
    if (file.length > 0) {
      const flattenedOutput = `${output.split('/')[0]}/${output.split('/').reverse()[0]}`;
      copy(`${filePath}`, `${PATHS.output}/${flattenedOutput}`);
    } else if (output.includes('assets/images' || 'assets/fonts')) {
      copy(`${filePath}`, `${PATHS.output}/assets/${output.split('/')[2]}`);
    } else {
      copy(`${filePath}`, `${PATHS.output}/${output}`);
    }
  });
};

/**
 * Delete files
 * @desc Delete files from dist folder
 */
const unlinkFile = (output) => {
  try {
    if (output.includes('assets/images' || 'assets/fonts')) {
      fs.unlinkSync(`${PATHS.output}/assets/${output.split('/')[2]}`);
    } else {
      fs.unlinkSync(`${PATHS.output}/${output}`);
    }
    log(chalk.bgHex('#fdcb6e').black(`[${output} deleted]`));
  } catch (error) {
    log(chalk.bgHex('#fdcb6e').black(`[error occurred trying to delete ${output}]`));
  }
};

/**
 * Ignored files
 * @desc Ignored files which are processed by webpack.
 */
let ignorePaths;
const ignoreAssets = async () => {
  await new Promise((resolve, reject) => {
    glob(`${PATHS.src}/assets/{scripts,styles}`,
      (err, res) => {
        if (err) {
          reject(err);
        }
        const assetFiles = [...res];
        ignorePaths = assetFiles;
        resolve('done');
        return res;
      });
  });
};

/**
 * Watch files with Chokidar
 * @desc Chokidar watches on add, change and delete. Ignore paths passed in.
 * https://github.com/paulmillr/chokidar
 */
const watcher = async () => {
  await new Promise((resolve, reject) => {
    const watch = chokidar.watch(`${PATHS.src}`, {
      persistent: true,
      usePolling: true,
      ignored: ignorePaths,
      interval: 1000,
      ignoreInitial: true,
    });
    watch
      .on('add', (filePath) => {
        const output = slash(filePath).split('/src/')[1];
        copyFile(output, slash(filePath));
        log(chalk.bgHex('#00b894').white(`[${output} added]`));
      })
      .on('change', (filePath) => {
        const output = slash(filePath).split('/src/')[1];
        copyFile(output, slash(filePath));
        log(chalk.bgHex('#563ce7').white(`[${output} modified]`));
      })
      .on('unlink', (filePath) => {
        const output = slash(filePath).split('/src/')[1];
        unlinkFile(output);
      });
    resolve('done');
  });
};

(async () => {
  await ignoreAssets();
  await watcher();
})();
