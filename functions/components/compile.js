
import { removeSync, copy, outputFileSync } from 'fs-extra';
import path from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';
import chalk from 'chalk';
import { minify } from 'html-minifier';

const { log } = console;

/**
  @desc Define input and output paths
*/
const PATHS = {
  src: path.resolve(__dirname, '../../src'),
  output: path.resolve(__dirname, '../../dist'),
};

/**
  @desc Clear current dist directory
*/
log(chalk.bgHex('#563ce7').white('[Clear directory]'));
removeSync(path.resolve(__dirname, '../../dist'));

/**
  @desc Synchronously pipe all required files
*/
log(chalk.bgHex('#563ce7').white('[Rebuilding distribution..]'));

// Minify liquid
const minifyLiquid = (file) => {
  const content = readFileSync(file, 'utf8');
  const output = minify(content, {
    collapseWhitespace: true,
    decodeEntities: true,
    minifyJS: true,
    removeComments: true,
    removeRedundantAttributes: true,
    ignoreCustomFragments: [/{%(.*?)%}/g]
  });
  return output;
};

const fetchFiles = (extension, callback) => {
  glob(`${PATHS.src}/**/*.${extension}`, { ignore: [`${PATHS.src}/!(assets)*/!(customers)*/*.${extension}`] },
    callback);
};

fetchFiles('liquid', (err, res) => {
  const files = res;
  files.forEach((file) => {
    const minifiedFile = minifyLiquid(file);
    const output = `${PATHS.output}/${file.split('/src/')[1]}`;
    outputFileSync(output, minifiedFile, (error) => {
      if (error) throw error;
    });
  });
});

fetchFiles('json', (err, res) => {
  const files = res;
  files.forEach((file) => {
    const output = `${PATHS.output}/${file.split('/src/')[1]}`;
    copy(file, output);
  });
});

const fetchSubDirectories = (callback) => {
  glob(`${PATHS.src}/!(assets)*/!(customers)*/*.liquid`, callback);
};

fetchSubDirectories((err, res) => {
  const files = res;
  files.forEach((file) => {
    const minifiedFile = minifyLiquid(file);
    const flattenedPath = `${file.split('/src/')[1].split('/')[0]}/${file.split('/src/')[1].split('/').reverse()[0]}`;
    const output = `${PATHS.output}/${flattenedPath}`;
    outputFileSync(output, minifiedFile, (error) => {
      if (error) throw error;
    });
  });
});

/**
  @desc Flatten all assets files
*/
const assets = (callback) => {
  glob(`${PATHS.src}/assets/**/*`, { ignore: [`${PATHS.src}/assets/{scripts,styles}`, `${PATHS.src}/assets/{scripts,styles}/**/*`] },
    callback);
};

assets((err, res) => {
  const assetFiles = res;
  assetFiles.forEach((dir) => {
    const output = dir.split('/').reverse()[0];
    const hasExtension = output.indexOf('.') >= 0;
    if (hasExtension) {
      copy(`${dir}`, `${PATHS.output}/assets/${output}`);
    }
  });
});
