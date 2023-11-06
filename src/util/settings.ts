import {recalcCSS} from "../injected/youtube/overlay";

export interface BaseSetting<T> {
    id: string;
    name: string;
    value: T;
}

export interface Checkbox extends BaseSetting<boolean> {
    type: "checkbox";
}

export interface DropdownChoices {
    choices: string[];
    selected: number;
}

export interface Dropdown extends BaseSetting<DropdownChoices> {
    type: "dropdown";
}

export type Setting = Checkbox | Dropdown;

export let SettingsManager = {
    enabled: {
        type: "checkbox" as const,
        value: true,
        id: "enabled",
        name: "Enable converter",
    },
    testing: {
        type: "checkbox" as const,
        value: false,
        id: "testing",
        name: "Test",
    },
    textSize: {
        type: "dropdown" as const,
        value: {
            choices: ["2.5rem", "2rem", "1.5rem", "1rem"],
            selected: 0,
        },
        id: "textSize",
        name: "Text Size",
    },
    unitSelection: {
        type: "dropdown" as const,
        value: {
            choices: ["metric", "imperial"],
            selected: 0,
        },
        id: "unitSelection",
        name: "Unit",
    },
    textColor: {
        type: "dropdown" as const,
        value: {
            choices: ["white", "blue", "aqua"],
            selected: 0,
        },
        id: "textClr",
        name: "Text Color",
    },
};
export type Settings = typeof SettingsManager;

export async function getSettings(): Promise<Settings> {
    return new Promise<Settings>((res, rej) => {
        chrome.storage.sync.get(["settings"], (result) => {
            const newSettings = result.settings;
            SettingsManager = newSettings;
            res(newSettings)
        });
    })
}

export function updateSettings() {
    chrome.storage.sync.get(["settings"], (result) => {
        const newSettings = result.settings;
        SettingsManager = newSettings;
        recalcCSS();
        console.log("updated settings", newSettings);
    });
}
