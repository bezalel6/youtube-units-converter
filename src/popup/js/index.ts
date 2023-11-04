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
import {
  BaseSetting,
  Checkbox,
  Dropdown,
  DropdownChoices,
  Setting,
  SettingsManager,
} from "../../util/settings";
import { shallowEqual } from "../../util/utils";

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
// interface Options {
//   [key: string]: boolean;
// }
// function createOption(name: string, id: string) `{
//   return `<div class="custom-control custom-switch">
//         <input type="checkbox" class="custom-control-input option-input" id="feature1">
//         <label class="custom-control-label" for="feature1">Enable Feature 1</label>
//       </div>`;
// }
class Popup {
  private options: typeof SettingsManager;

  constructor() {
    this.loadOptions().then(() => this.bindInputs());
    this.getForm().addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveOptions();
    });
    // this.bindInputs();
  }
  private getForm() {
    return get<HTMLFormElement>("#options-form");
  }
  private bindInputs(): void {
    console.log("binding!");
    for (const optionKey in this.options) {
      const option = this.options[optionKey as keyof typeof SettingsManager];
      const e = get(`#${option.id}`);
      console.log("adding change listener to", e);
      e.addEventListener("change", (ev) => {
        option.value = handler(option).getValue(option.id).value as any;
        console.log("change", ev, "setting value", option.value);
      });
    }
    // Bind change events to all inputs with the 'option-input' class
    // const inputs = document.querySelectorAll(".option-input");
    // inputs.forEach((input) => {
    //   // Initialize the state of the options
    //   const checkbox = input as HTMLInputElement;
    //   this.options[checkbox.id] = checkbox.checked;
    //   // Listen for changes on each input
    //   checkbox.addEventListener("change", () => {
    //     this.options[checkbox.id] = checkbox.checked;
    //   });
    // });
  }

  private async loadOptions() {
    // Load options from storage
    return new Promise((res, rej) => {
      chrome.storage.sync.get(["settings"], (result) => {
        if (result.settings && shallowEqual(result.settings, SettingsManager)) {
          console.log("found options in settings", result.settings);
          this.options = result.settings;
        } else {
          if (
            result.settings &&
            !shallowEqual(result.settings, SettingsManager)
          ) {
            console.log(
              "shallow equal didnt work. storage:",
              result.settings,
              "going with default settings",
              SettingsManager
            );
          }
          this.options = SettingsManager;
        }
        // Update the input elements
        for (const key in this.options) {
          const option = this.options[key as keyof typeof SettingsManager];
          // const e = get(`#${option.id}`);
          let handle = handler(option);
          this.getForm().appendChild(handle.createElement(option.id));
          handle.setValue(option.id, option.value as any);
        }
        res(null);
      });
    });
  }
  private saveOptions(): void {
    // Save the current state of the options to storage
    chrome.storage.sync.set({ settings: this.options }, () => {
      console.log("Options saved:", this.options);
    });
  }
}
// function handler(setting: Checkbox): Handler;
// function handler(setting: Dropdown): Handler;
function handler(setting: Setting): Handler {
  switch (setting.type) {
    case "checkbox":
      return {
        createElement(id) {
          const div = document.createElement("div");
          div.className = "custom-control custom-switch";
          const e = document.createElement("input");
          e.type = "checkbox";
          e.className = "custom-control-input";
          e.id = id;
          const lbl = document.createElement("label");
          lbl.className = "custom-control-label";
          lbl.htmlFor = id;
          lbl.textContent = setting.name;

          div.appendChild(e);
          div.appendChild(lbl);
          return div;
          //   <div class="custom-control custom-switch">
          //   <input type="checkbox" class="custom-control-input" id="${option.id}">
          //   <label class="custom-control-label" for="${option.id}">${option.name}</label>
          // </div>`;
        },
        getValue(id) {
          const e = get(`#${id}`);
          return {
            id: id,
            name: setting.name,
            type: setting.type,
            value: e.checked,
          };
        },
        setValue(id, value) {
          get(`#${id}`).checked = value as boolean;
        },
      };
    case "dropdown":
      return {
        createElement(id) {
          const select = document.createElement("select");
          select.id = id;
          setting.value.choices.forEach((choice, index) => {
            const optionElement = new Option(choice, choice);
            optionElement.selected = index === setting.value.selected;
            select.add(optionElement);
          });
          return select;
        },
        getValue(id) {
          const select = get<HTMLSelectElement>(`#${id}`);
          return {
            id: id,
            name: setting.name,
            type: setting.type,
            value: {
              choices: setting.value.choices,
              selected: select.selectedIndex,
            },
          };
        },
        setValue(id, value) {
          const select = get<HTMLSelectElement>(`#${id}`);
          select.options.length = 0; // Clear existing options
          const conv = value as DropdownChoices;
          conv.choices.forEach((choice, index) => {
            const optionElement = new Option(choice, choice);
            select.add(optionElement);
            if (index === conv.selected) {
              select.selectedIndex = index;
            }
          });
        },
      };
  }
  // switch(setting)
}
interface Handler {
  getValue: (id: string) => Setting;
  setValue: (id: string, value: Setting["value"]) => void;
  createElement: (id: string) => Element;
}
