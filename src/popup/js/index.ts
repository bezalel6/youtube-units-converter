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

import "../scss/styles.scss";

import { getMessage } from "../../util/message";
import {
  simpleRequestSystem,
  createSimpleRequest,
} from "../../messaging/request_systems/simple_request";
const utilMessage: string = getMessage();
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  const activeTab = tabs[0];
  simpleRequestSystem.sendRequestToTab(
    activeTab.id!,
    createSimpleRequest({ message: "popup-popped" })
  );
  // chrome.tabs.sendMessage(activeTab.id, { message: "start" });
});
console.log(utilMessage);
const messages = ["hello", "from", "popup", "made", "with", "typescript"];
for (const message of messages) {
  console.log(message);
}
