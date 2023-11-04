/**
 * @file
 * @author Albert Patterson <albert.patterson.code@gmail.com>
 * @see [Linkedin]{@link https://www.linkedin.com/in/apattersoncmu/}
 * @see [Github]{@link https://github.com/albertpatterson}
 * @see [npm]{@link https://www.npmjs.com/~apatterson189}
 * @see [Youtube]{@link https://www.youtube.com/channel/UCrECEffgWKBMCvn5tar9bYw}
 * @see [Medium]{@link https://medium.com/@albert.patterson.code}
 *
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
import {
  captionsSetup,
  createOverlay,
  isOverlayAdded,
  setText,
} from "./overlay";
import { updateSettings } from "../../util/settings";
import { updateSourceFile } from "typescript";

/**
 * handle requests sent via the message system
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("received request in tab", request);
  if (request.data.message == "popup-popped") {
    // run();
    setText("YES I AM HERE");
  } else if (request.data.message === "settings-change") {
    updateSettings();
  }
  return handleRequestInTab(request, sender, sendResponse);
});

function run() {
  console.log("running...");
  const videoId = getVideoId();
  if (videoId) {
    if (isOverlayAdded()) {
      console.log("overlay exists. not recreating");
    } else {
      transcribe(videoId).then((captions) => {
        console.log(captions);
        createOverlay();
        captionsSetup(captions);
      });
    }
  } else {
    console.error("couldnt get video id");
  }
}

// Listen for popstate event
window.addEventListener("popstate", function (event) {
  // onUrlChange(document.location.href);
  console.log("popstate event");
  run();
});
window.addEventListener("DOMContentLoaded", function (event) {
  // onUrlChange(document.location.href);
  console.log("doc content loaded");
  run();
});

// Observe the body or a specific element that changes when navigating to a new video
const config = { childList: true, subtree: true };

// Store the current URL for comparison
let currentUrl = document.location.href;

// Create a mutation observer to listen for changes in the DOM
// It could indicate a change in content without a popstate event
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // Check if the URL has changed
    if (document.location.href !== currentUrl) {
      // onUrlChange(document.location.href);
      currentUrl = document.location.href; // Update the current URL
      run();
    }
  });
});
observer.observe(document.body, config);

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
  chrome.storage.sync.get(["settings"], (result) => {
    console.log(result);
  });
  run();
  // const result = await simpleRequestSystem.sendRequestToServiceWorker(
  //   createSimpleRequest({ message: msg })
  // );
  // console.log("received response (from service worker):");
  // logResponse(result);
})();
