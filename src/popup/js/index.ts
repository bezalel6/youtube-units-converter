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
import {defaultSettings, Setting, Settings, settingsManager} from "../../util/settings"; // Adjust the import path as necessary

// chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
//     const activeTab = tabs[0];
//     simpleRequestSystem.sendRequestToTab(
//         activeTab.id!,
//         createSimpleRequest({message: "popup-popped"})
//     );
// });
//
// document.addEventListener("DOMContentLoaded", function () {
//     new Popup();
//
//     get("#delete-storage").onclick = () => {
//         chrome.storage.sync.remove(["settings"]).then(() => {
//             console.log("deleted storage")
//         });
//     }
// });
//
// class Popup {
//     // private options: typeof SettingsManager;
//
//     constructor() {
//         this.loadOptions().then(() => this.bindInputs()).then(() => saveSettings(this.options));
//         this.getForm().addEventListener("submit", (e) => {
//             e.preventDefault();
//             this.saveOptions();
//         });
//         this.getForm().addEventListener("reset", (e) => {
//             e.preventDefault();
//             this.loadOptions(true).then(() => this.bindInputs());
//         });
//         // this.bindInputs();
//     }
//
//     private getForm() {
//         return get<HTMLFormElement>("#options-form");
//     }
//
//     private bindInputs(): void {
//         console.log("binding!");
//         for (const optionKey in this.options) {
//             const option = this.options[optionKey as keyof typeof SettingsManager];
//             const e = get(`#${option.id}`);
//             console.log("adding change listener to", e);
//             e.addEventListener("change", (ev) => {
//                 option.value = handler(option).getValue(option.id).value as any;
//                 console.log("change", ev, "setting value", option.value);
//                 this.saveOptions();
//             });
//         }
//         // Bind change events to all inputs with the 'option-input' class
//         // const inputs = document.querySelectorAll(".option-input");
//         // inputs.forEach((input) => {
//         //   // Initialize the state of the options
//         //   const checkbox = input as HTMLInputElement;
//         //   this.options[checkbox.id] = checkbox.checked;
//         //   // Listen for changes on each input
//         //   checkbox.addEventListener("change", () => {
//         //     this.options[checkbox.id] = checkbox.checked;
//         //   });
//         // });
//     }
//
//     private async loadOptions(backToDefault: boolean = false) {
//         // Load options from storage
//         return new Promise((res, rej) => {
//             chrome.storage.sync.get(["settings"], (result) => {
//                 if (
//                     !backToDefault &&
//                     result.settings &&
//                     shallowEqual(result.settings, SettingsManager)
//                 ) {
//                     console.log("found options in settings", result.settings);
//                     this.options = result.settings;
//                 } else {
//                     if (
//                         result.settings &&
//                         !shallowEqual(result.settings, SettingsManager)
//                     ) {
//                         console.log(
//                             "shallow equal didnt work. storage:",
//                             result.settings,
//                             "going with default settings",
//                             SettingsManager
//                         );
//                     }
//                     this.options = SettingsManager;
//
//                 }
//                 this.getForm().querySelectorAll(':scope > :not(.stay-btn)').forEach(child => {
//                     this.getForm().removeChild(child);
//                 });
//                 // Update the input elements
//                 const elements: Element[] = []
//                 for (const key in this.options) {
//                     const option = this.options[key as keyof typeof SettingsManager];
//                     // const e = get(`#${option.id}`);
//                     let handle = handler(option);
//                     const gen = handle.createElement(option.id);
//                     gen.classList.add("custom-gen");
//                     console.log('creating element', key)
//                     elements.push(gen)
//                     // this.getForm().prepend(gen);
//                     // handle.setValue(option.id, option.value as any);
//                 }
//                 this.getForm().prepend(...elements)
//                 for (const key in this.options) {
//                     const option = this.options[key as keyof typeof SettingsManager];
//                     // const e = get(`#${option.id}`);
//                     let handle = handler(option);
//                     handle.setValue(option.id, option.value as any);
//                 }
//                 res(null);
//             });
//         });
//     }
//
//     private saveOptions(): void {
//         // Save the current state of the options to storage
//         chrome.storage.sync.set({settings: this.options}, () => {
//             console.log("Options saved:", this.options);
//             chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
//                 const activeTab = tabs[0];
//                 simpleRequestSystem.sendRequestToTab(
//                     activeTab.id!,
//                     createSimpleRequest({message: "settings-change"})
//                 );
//             });
//         });
//     }
// }


// function handler(setting: Checkbox): Handler;
// function handler(setting: Dropdown): Handler;

// interface Handler {
//     getValue: (id: string) => Setting;
//     setValue: (id: string, value: Setting["value"]) => void;
//     createElement: (id: string) => Element;
//     bind?: () => void;
// }

/**
 * @file
 * ... (Author comments and metadata remain unchanged)
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

document.addEventListener("DOMContentLoaded", async () => {
    const popup = new Popup();
    await popup.loadOptions();
    popup.bindInputs();
});

class Popup {
    private options: ReturnType<typeof settingsManager['getAllSettings']>;

    constructor() {

    }

    public static close() {
        var daddy = window.self;
        daddy.opener = window.self;
        daddy.close();
    }

    async loadOptions(): Promise<void> {
        this.options = await settingsManager.loadSettings();
        this.bindInputs();

    }

    bindInputs(): void {
        const form = this.getForm();
        form.innerHTML = ``; // Reset the form UI
        // form.querySelectorAll('form > :not(.stay-btn)').forEach(child => {
        //     console.log("removing", child)
        //     child.remove();
        // })
        const settings = settingsManager.getAllSettings();
        Object.keys(defaultSettings).forEach((key) => {
            // Assert 'key' is actually a keyof Settings
            const optionKey = key as keyof Settings;
            // const option = this.options[optionKey];
            const option = settings[optionKey];
            
            const inputElement = createInputForSetting(optionKey, option);
            // form.appendChild(inputElement);
            // console.log('before setting value for input', {optionKey, option, inputElement})
            // Now TypeScript knows that 'inputElement' is associated with a key of 'Settings'
            setValueForInput(inputElement, option);
            // console.log('after setting value for input', {optionKey, option})

            // inputElement.addEventListener('change', () => {
            //
            //     const newValue = getValueFromInput(inputElement);
            //     console.log("change!!!")
            //     // Again, assert that 'optionKey' is a keyof Settings
            //     settingsManager.updateSetting(optionKey, newValue);
            // });
        });

        form.innerHTML += `<button class="stay-btn btn btn-primary mb-2 w-100 last" type="reset">Reset to default</button>`;
        form.addEventListener("reset", (e) => {
            e.preventDefault();
            this.loadOptions();
        })
        form.querySelectorAll(".changing").forEach(c => {
            c.addEventListener("change", (e) => {
                console.log("got change")
                const val = getValueFromInput(e.target as HTMLElement)
                console.log("got new value from input", val)
                settingsManager.updateSetting((e.target as HTMLElement).id as any, val);
            })
        })

    }

    private getForm() {
        return get<HTMLFormElement>("#options-form");
    }

    private saveOptions(): void {
        settingsManager.saveSettings().then(() => {
            console.log("Settings saved.");
            // Notify any listeners that settings have changed
            chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
                const activeTab = tabs[0];
                simpleRequestSystem.sendRequestToTab(
                    activeTab.id!,
                    createSimpleRequest({message: "settings-change"})
                );
            });
        }).catch(console.error);
    }
}

function createInputForSetting(id: string, setting: Setting): HTMLElement {
    // Create different types of input elements based on the setting type
    // This function needs to be implemented based on the specific requirements
    // ...
    console.log('creating input for setting', setting, "with id", id)
    return handler(setting).createElement(id)
}

function setValueForInput(inputElement: HTMLElement, value: Setting): void {
    // Set the input element's value based on the setting value
    // This function needs to be implemented based on the specific requirements
    // ...
    // console.log(inputElement)
    // const setting = settingsManager.getSetting(inputElement.id as keyof Settings);
    // console.log('got setting to set value for', setting)
    handler(value).setValue(inputElement.id, value);
}

function getValueFromInput(inputElement: HTMLElement): any {
    // Get the input element's value and return it
    // This function needs to be implemented based on the specific requirements
    // ...
    const setting = settingsManager.getSetting(inputElement.id as keyof Settings);
    // console.log('got setting')
    return handler(setting).getValue(inputElement.id);
}

// Handler function remains as in your original code
function handler(setting: Setting): Handler {
    console.log('getting handler', setting)

    function addElement(e: Element) {
        getForm().append(e);
    }

    function getForm() {
        return get<HTMLFormElement>("#options-form");
    }

    switch (setting.type) {

        case "checkbox":
            return {
                createElement(id) {
                    const div = document.createElement("div");
                    div.className = "custom-control custom-switch mb-2"; // Bootstrap switch class with margin-bottom
                    const input = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "changing custom-control-input"; // Bootstrap input class
                    input.id = id;
                    const label = document.createElement("label");
                    label.className = "custom-control-label"; // Bootstrap label class
                    label.htmlFor = id;
                    label.textContent = setting.name;
                    div.appendChild(input);
                    div.appendChild(label);
                    addElement(div);
                    return input;
                },
                getValue(id) {
                    const e = get<HTMLInputElement>(`#${id}`);
                    return {
                        id: id,
                        name: setting.name,
                        type: setting.type,
                        value: e.checked,
                    };
                },
                setValue(id, value) {
                    console.log("setting value on checkbox", id, "value is", value)
                    get<HTMLInputElement>(`#${id}`).checked = value as boolean;
                },
            };
        case "positionAdjust":
            return {
                createElement(id) {
                    const div = document.createElement("div");

                    // div.className = "btn-group mb-2"; // Bootstrap button group class with margin-bottom
                    const button = document.createElement("button");
                    button.className = "changing btn btn-secondary mb-2 w-100"; // Bootstrap button class
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

                        setTimeout(Popup.close, 100);
                    });
                    div.appendChild(button);
                    addElement(div);

                    return button;
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
                // Example adjustments for `positionAdjust`
                setValue(id, value) {
                    const e = get<HTMLButtonElement>(`#${id}`);
                    // Assuming `value` contains the `x` and `y` properties
                    e.setAttribute("pos", JSON.stringify({x: value.x, y: value.y}));
                    e.setAttribute("checked", value.isMoving + "");
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
                    select.className = "changing form-control custom-select mb-3"; // Use Bootstrap's form control and custom-select classes
                    // Add options to the select element
                    setting.choices.forEach((choice) => {
                        const option = document.createElement("option");
                        option.value = choice;
                        option.textContent = choice;
                        select.appendChild(option);
                    });
                    div.appendChild(label);
                    div.appendChild(select);
                    addElement(div);
                    return select;
                },
                getValue(id) {
                    const select = get<HTMLSelectElement>(`#${id}`);
                    const choices = []
                    let i = 0;
                    let selected = 0;
                    for (const op of select.options) {
                        choices.push(op.value)
                        if (i === select.selectedIndex) {
                            selected = i;
                        }
                        i++;
                    }
                    console.log('getting value for', id, 'values', {choices, selected: choices[selected]})
                    return {
                        id: id,
                        name: setting.name,
                        type: setting.type,
                        choices,
                        value: choices[selected]
                    };
                },
                // setValue(id, value) {
                //     console.log('setting value for id:', id, 'value is:', value)
                //     const select = get<HTMLSelectElement>(`#${id}`);
                //     select.options.length = 0; // Clear existing options
                //     // const conv = settingsManager.getSetting(id as any);
                //     // console.log({conv})
                //     value.choices.forEach((choice: string, index: number) => {
                //         const optionElement = new Option(choice, choice);
                //         select.add(optionElement);
                //         if (choice === value) {
                //             select.selectedIndex = index;
                //         }
                //     });
                // },
                setValue(id, value) {
                    console.log("setting dropdown value for", id, "value is", value.value)
                    const select = get<HTMLSelectElement>(`#${id}`);
                    select.value = value.value; // This assumes `value` is one of the choices
                },

            };
    }
    // switch(setting)
}


// Handler interface remains as in your original code
interface Handler {
    getValue: (id: string) => any;
    setValue: (id: string, value: any) => void;
    createElement: (id: string) => HTMLElement;
}

// Continue with the rest of the implementation...
