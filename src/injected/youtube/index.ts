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

import {handleRequestInTab} from "../../messaging/framework/handle_request";
import {transcribe} from "./transcriber";
import {captionsSetup, createOverlay,} from "./overlay";
import {log} from "./logger";
import "./styles.css"
import convert from 'convert'
import {settingsManager} from "../../util/settings";
// gotta import it so webpack keeps it so it can be dynamically imported later
console.log("convert says:", convert(69, "kg").to("best", "metric").toString(0))
/**
 * handle requests sent via the message system
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("received request in tab", request);
    if (request.data.message == "popup-popped") {
        // run();
    } else if (request.data.message === "settings-change") {
        settingsManager.loadSettings();

    }
    return handleRequestInTab(request, sender, sendResponse);
});

let currentVideoID: string | null;

function run() {
    console.log("running...");
    const videoId = getVideoId();

    if (videoId && videoId != currentVideoID) {
        currentVideoID = videoId;
        // if (isOverlayAdded()) {
        //     console.log("overlay exists. not recreating");
        // } else {
        transcribe(videoId)
            .then((captions) => {
                console.log(captions);
                createOverlay();
                captionsSetup(captions);
            })
            .catch(e => {
                // if(e instanceof  NotConnectedToServerErr){
                log("not connected to server", "error")
                // }

            });
        // }
    } else {
        if (!videoId)
            console.error("couldnt get video id");
        else if (videoId === currentVideoID) {
            console.log("already running on this id")
        }
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
const config = {childList: true, subtree: true};

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
// function getVideoId(): string | null {
//   const url = window.location.href;
//   const urlObj = new URL(url);
//   const params = new URLSearchParams(urlObj.search);
//   if (!params.has("v")) return null;
//   return params.get("v");
// }

function getVideoId() {
    const url = window.location.href;
    console.log("looking for video id in ", url);
    // Check if URL is a YouTube Shorts URL
    if (url.includes("youtube.com/shorts/")) {
        console.log("--shorts detected--");
        // Extract the video ID from the Shorts URL
        const shortsId = url.split("youtube.com/shorts/")[1];
        return shortsId ? shortsId.split("?")[0] : null; // Split at '?' to ensure only the ID is returned
    } else {
        console.log("not shorts.");
        // Proceed with the original logic for regular YouTube URLs
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        const res = params.has("v") ? params.get("v") : null;
        console.log("returning", res);
        return res;
    }
}

(async () => {
    console.log(`loaded in ${document.title}`);
    chrome.storage.sync.get(["settings"], (result) => {
        console.log(result);
    });
    run();

    // const {convert} = await import("convert")
//
//     console.log("converted:", convert(13, "km").to("best", "imperial"))
    // const result = await simpleRequestSystem.sendRequestToServiceWorker(
    //   createSimpleRequest({ message: msg })
    // );
    // console.log("received response (from service worker):");
    // logResponse(result);
})();

