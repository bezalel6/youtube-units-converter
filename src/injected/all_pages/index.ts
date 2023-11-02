/**
 * @file
 * @author Albert Patterson <albert.patterson.code@gmail.com>
 * @see [Linkedin]{@link https://www.linkedin.com/in/apattersoncmu/}
 * @see [Github]{@link https://github.com/albertpatterson}
 * @see [npm]{@link https://www.npmjs.com/~apatterson189}
 * @see [Youtube]{@link https://www.youtube.com/channel/UCrECEffgWKBMCvn5tar9bYw}
 * @see [Medium]{@link https://medium.com/@albert.patterson.code}
 *
 * Free software under the GPLv3 licence. Permissions of this strong copyleft
 * license are conditioned on making available complete source code of
 * licensed works and modifications, which include larger works using a
 * licensed work, under the same license. Copyright and license notices must
 * be preserved. Contributors provide an express grant of patent rights.
 */

import { handleRequestInTab } from '../../messaging/framework/handle_request';
import { logResponse } from '../../messaging/util';
import {
  simpleRequestSystem,
  createSimpleRequest,
} from '../../messaging/request_systems/simple_request';

/**
 * handle requests sent via the message system
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received request in tab', request);

  return handleRequestInTab(request, sender, sendResponse);
});

/**
 * Top level extension logic
 */
(async () => {
  const msg = `page with title "${document.title}" loaded!`;
  console.log(
    `sending simple request in tab (to service worker) with message "${msg}"`
  );
  const result = await simpleRequestSystem.sendRequestToServiceWorker(
    createSimpleRequest({ message: msg })
  );
  console.log('received response (from service worker):');
  logResponse(result);
})();
