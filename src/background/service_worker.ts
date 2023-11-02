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

import { handleRequestInServiceWorker } from "../messaging/framework/handle_request";

/**
 * handle requests sent via the message system
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("received message in service worker", request);

  return handleRequestInServiceWorker(request, sender, sendResponse);
});
chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    chrome.scripting
      .executeScript({
        target: { tabId: details.tabId },
        files: ["injected/youtube.js"],
      })
      .then(() => console.log("script injected"));
    // chrome.tabs.executeScript(details.tabId, {
    //   file: "youtube.js",
    // });
  },
  { url: [{ hostSuffix: "youtube.com" }] }
);

/**
 * Top level extension logic
 */
(async () => {
  console.log("Extension loaded");
})();
