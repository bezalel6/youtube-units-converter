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

import {createSimpleRequest, simpleRequestSystem,} from "../../messaging/request_systems/simple_request";
import {DropdownChoices, PositionAdjustValue, saveSettings, Setting, SettingsManager,} from "../../util/settings";
import {shallowEqual} from "../../util/utils";

// chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
//     const activeTab = tabs[0];
//     simpleRequestSystem.sendRequestToTab(
//         activeTab.id!,
//         createSimpleRequest({message: "popup-popped"})
//     );
// });

function get<T = HTMLInputElement>(selector: string): T {
    const e = document.querySelector(selector);
    if (!e) {
        console.error("COULD NOT FIND SELECTOR: ", selector);
        throw new Error("Selector not found");
    }
    return e as unknown as T;
}

document.addEventListener("DOMContentLoaded", function () {
    new Popup();

    get("#delete-storage").onclick = () => {
        chrome.storage.sync.remove(["settings"]).then(() => {
            console.log("deleted storage")
        });
    }
});

class Popup {
    private options: typeof SettingsManager;

    constructor() {
        this.loadOptions().then(() => this.bindInputs()).then(() => saveSettings(this.options));
        this.getForm().addEventListener("submit", (e) => {
            e.preventDefault();
            this.saveOptions();
        });
        this.getForm().addEventListener("reset", (e) => {
            e.preventDefault();
            this.loadOptions(true).then(() => this.bindInputs());
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
                this.saveOptions();
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

    private async loadOptions(backToDefault: boolean = false) {
        // Load options from storage
        return new Promise((res, rej) => {
            chrome.storage.sync.get(["settings"], (result) => {
                if (
                    !backToDefault &&
                    result.settings &&
                    shallowEqual(result.settings, SettingsManager)
                ) {
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
                this.getForm().querySelectorAll(':scope > :not(.stay-btn)').forEach(child => {
                    this.getForm().removeChild(child);
                });
                // Update the input elements
                const elements: Element[] = []
                for (const key in this.options) {
                    const option = this.options[key as keyof typeof SettingsManager];
                    // const e = get(`#${option.id}`);
                    let handle = handler(option);
                    const gen = handle.createElement(option.id);
                    gen.classList.add("custom-gen");
                    console.log('creating element', key)
                    elements.push(gen)
                    // this.getForm().prepend(gen);
                    // handle.setValue(option.id, option.value as any);
                }
                this.getForm().prepend(...elements)
                for (const key in this.options) {
                    const option = this.options[key as keyof typeof SettingsManager];
                    // const e = get(`#${option.id}`);
                    let handle = handler(option);
                    handle.setValue(option.id, option.value as any);
                }
                res(null);
            });
        });
    }

    private saveOptions(): void {
        // Save the current state of the options to storage
        chrome.storage.sync.set({settings: this.options}, () => {
            console.log("Options saved:", this.options);
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                const activeTab = tabs[0];
                simpleRequestSystem.sendRequestToTab(
                    activeTab.id!,
                    createSimpleRequest({message: "settings-change"})
                );
            });
        });
    }
}

function closePopup() {
    var daddy = window.self;
    daddy.opener = window.self;
    daddy.close();
}

// function handler(setting: Checkbox): Handler;
// function handler(setting: Dropdown): Handler;
function handler(setting: Setting): Handler {
    switch (setting.type) {

        case "checkbox":
            return {
                createElement(id) {
                    const div = document.createElement("div");
                    div.className = "custom-control custom-switch mb-2"; // Bootstrap switch class with margin-bottom
                    const input = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "custom-control-input"; // Bootstrap input class
                    input.id = id;
                    const label = document.createElement("label");
                    label.className = "custom-control-label"; // Bootstrap label class
                    label.htmlFor = id;
                    label.textContent = setting.name;
                    div.appendChild(input);
                    div.appendChild(label);
                    return div;
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
        case "positionAdj":
            return {
                createElement(id) {
                    const div = document.createElement("div");

                    // div.className = "btn-group mb-2"; // Bootstrap button group class with margin-bottom
                    const button = document.createElement("button");
                    button.className = "btn btn-secondary mb-2 w-100"; // Bootstrap button class
                    button.id = id;
                    button.textContent = setting.name;
                    button.addEventListener('click', function () {
                        button.setAttribute("checked", (!(button.getAttribute("checked") === "true")) + "")
                        // Create a new 'change' event for the button
                        const event = new Event('change', {
                            'bubbles': true,
                            'cancelable': true
                        });


                        // Dispatch it on the button itself
                        this.dispatchEvent(event);

                        setTimeout(closePopup, 1000);
                    });
                    div.appendChild(button);
                    return div;
                },
                getValue(id) {
                    const e = get(`#${id}`);

                    return {
                        id: id,
                        name: setting.name,
                        type: setting.type,
                        value: {
                            isMoving: e.getAttribute("checked") === "true",
                            pos: JSON.parse(e.getAttribute("pos")!)
                        },
                    };
                },
                setValue(id, value) {
                    const cVal = value as PositionAdjustValue;
                    const e = get<HTMLButtonElement>(`#${id}`);

                    e.setAttribute("pos", JSON.stringify(cVal.pos))
                    e.setAttribute("checked", cVal.isMoving + "");

                },
            };
        case "dropdown":
            return {
                createElement(id) {
                    const div = document.createElement("div");
                    div.className = "form-group"; // Use Bootstrap's form group class
                    const label = document.createElement("label");
                    label.htmlFor = id;
                    label.textContent = setting.name;
                    const select = document.createElement("select");
                    select.id = id;
                    select.className = "form-control custom-select mb-3"; // Use Bootstrap's form control and custom-select classes
                    // Add options to the select element
                    setting.value.choices.forEach((choice) => {
                        const option = document.createElement("option");
                        option.value = choice;
                        option.textContent = choice;
                        select.appendChild(option);
                    });
                    div.appendChild(label);
                    div.appendChild(select);
                    return div;
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
    bind?: () => void;
}
