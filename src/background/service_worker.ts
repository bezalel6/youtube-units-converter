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

import {handleRequestInServiceWorker} from "../messaging/framework/handle_request";

/// In background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "broadcast") {
        // Send the message to all tabs, not just active ones
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                // Check if the tab has an ID before sending a message
                if (tab.id !== undefined) {
                    chrome.tabs.sendMessage(tab.id, {...message});
                }
            });
        });
        // Optional: send a response back to the sender
        // sendResponse({status: "broadcast initiated"});
        // return true; // Keep the message channel open if you are using sendResponse asynchronously
    }
    return handleRequestInServiceWorker(message, sender, sendResponse);
});