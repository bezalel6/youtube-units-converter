import {defaultSettings, Settings} from "./settings";
import QuickSettings from "quicksettings";

export default function InitUI() {
// Create a new style element
    var style = document.createElement('style');
    style.type = 'text/css';

// Add CSS rules as text
    style.textContent = `
  body {
  height: max-content;
  width: max-content;
}
`;
// Append the style element to the document's head
    document.head.appendChild(style);

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


    function get<T extends HTMLElement>(selector: string): T {
        if (selector === "#") {

            throw new Error("trying to get empty id")
        }
        const element = document.querySelector(selector);
        if (!element) {
            console.error("Could not find selector: ", selector);
            throw new Error("Selector not found");
        }
        return element as T;
    }

    let settingsPanel = QuickSettings.create();
    settingsPanel.setDraggable(false);
// let settingsPanel = QuickSettings.create(undefined, undefined, undefined, document.body);
// settingsPanel.setWidth(200)
    document.addEventListener("DOMContentLoaded", async () => {
//    const popup = new Popup();
        //  await popup.loadOptions();
        //popup.bindInputs();
        settingsSetup(defaultSettings);
        settingsPanel.saveInLocalStorage("settings-panel")
    });

    function sendUpdatedSettings(settings: Settings) {
        // In popup.js
        chrome.runtime.sendMessage({action: "broadcast", type: "settings-update", data: settings})

    }

    function settingsSetup(settings: Settings) {
        Object.keys(settings).forEach(key => {
            const setting = settings[key as keyof Settings];
            switch (setting.type) {

                case "dropdown": {

                    settingsPanel.addDropDown(setting.name, setting.choices, (e) => {
                        // settingsManager.updateSetting(key, e.value)
                        setting.value = e.value;
                        console.log("dropdown change", e.value)
                        sendUpdatedSettings(settings)
                    })
                    break;
                }
                case "checkbox": {
                    settingsPanel.addBoolean(setting.name, setting.value, (e) => {
                        setting.value = e;
                        sendUpdatedSettings(settings)

                    })
                    break;
                }

            }
        })

    }
}