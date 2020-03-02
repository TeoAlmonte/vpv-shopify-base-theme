/**
 * Deploy node function
 * @desc Build files and deploys to server
 */

 import './components/compile';

import {
  makeDir, compile, deploy,
} from './components/theme-commands';

makeDir();

(async () => {
  await compile();
  deploy();
})();
