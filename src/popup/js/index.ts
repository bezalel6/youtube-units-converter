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

import {
  simpleRequestSystem,
  createSimpleRequest,
} from "../../messaging/request_systems/simple_request";

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  const activeTab = tabs[0];
  simpleRequestSystem.sendRequestToTab(
    activeTab.id!,
    createSimpleRequest({ message: "popup-popped" })
  );
  // chrome.tabs.sendMessage(activeTab.id, { message: "start" });
});

function get<T = HTMLInputElement>(selector: string): T {
  const e = document.querySelector(selector);
  if (!e) {
    console.error("COULDNT FIND SELECTOR: ", selector);
    throw "SHIT";
  }
  return e as unknown as T;
}

document.addEventListener("DOMContentLoaded", function () {
  new Popup();

  // var form = document.getElementById("options-form")!;
  // form.addEventListener("submit", function () {
  //   var feature1Enabled = (
  //     document.getElementById("feature1") as HTMLInputElement
  //   ).checked;
  //   var feature2Enabled = (
  //     document.getElementById("feature2") as HTMLInputElement
  //   ).checked;
  //   const obj = { feature1Enabled, feature2Enabled };
  //   chrome.storage.sync.set(obj, function () {
  //     console.log("Options saved.", obj);
  //   });
  // });
});
interface Options {
  [key: string]: boolean;
}

class Popup {
  private options: Options = {};

  constructor() {
    this.loadOptions();
    get<HTMLFormElement>("#options-form").addEventListener("submit", () =>
      this.saveOptions()
    );
    this.bindInputs();
  }

  private bindInputs(): void {
    // Bind change events to all inputs with the 'option-input' class
    const inputs = document.querySelectorAll(".option-input");
    inputs.forEach((input) => {
      // Initialize the state of the options
      const checkbox = input as HTMLInputElement;
      this.options[checkbox.id] = checkbox.checked;

      // Listen for changes on each input
      checkbox.addEventListener("change", () => {
        this.options[checkbox.id] = checkbox.checked;
      });
    });
  }

  private loadOptions(): void {
    // Load options from storage
    chrome.storage.sync.get(["options"], (result) => {
      if (result.options) {
        this.options = result.options;
        // Update the input elements
        for (const key in this.options) {
          const input = document.getElementById(key) as HTMLInputElement;
          if (input) input.checked = this.options[key];
        }
      }
    });
  }

  private saveOptions(): void {
    // Save the current state of the options to storage
    chrome.storage.sync.set({ options: this.options }, () => {
      console.log("Options saved.");
    });
  }
}
