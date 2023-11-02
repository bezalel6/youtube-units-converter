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

import { handleRequestInTab } from "../../messaging/framework/handle_request";
import { logResponse } from "../../messaging/util";
import {
  simpleRequestSystem,
  createSimpleRequest,
} from "../../messaging/request_systems/simple_request";
import { transcribe } from "./transcriber";
import { captionsSetup, createOverlay } from "./overlay";

/**
 * handle requests sent via the message system
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("received request in tab", request);
  if (request.data.message == "popup-popped") {
    const videoId = getVideoId();
    if (videoId) {
      transcribe(videoId).then((captions) => {
        console.log(captions);
        createOverlay();
        captionsSetup(captions);
      });
    } else {
      console.error("couldnt get video id");
    }
  }
  return handleRequestInTab(request, sender, sendResponse);
});

/**
 * Top level extension logic
 */
function getVideoId(): string | null {
  const url = window.location.href;
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  if (!params.has("v")) return null;
  return params.get("v");
}

(async () => {
  console.log(`loaded in ${document.title}`);

  // const result = await simpleRequestSystem.sendRequestToServiceWorker(
  //   createSimpleRequest({ message: msg })
  // );
  // console.log("received response (from service worker):");
  // logResponse(result);
})();

//todo overlay the converted text over the video
