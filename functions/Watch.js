/**
 * Watch node function
 * @desc Imports and executes functions required for watching theme
 */

import {
  makeDir, watchCompile, open, watch,
} from './components/theme-commands';

import './components/watch';

makeDir();
watchCompile();
open();
watch();
