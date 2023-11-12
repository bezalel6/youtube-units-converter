// Types for individual settings

import {recalcCSS} from "../injected/youtube/overlay";

export interface CheckboxSetting {
    type: 'checkbox';
    value: boolean;
    name: string;
}

export interface DropdownSetting {
    type: 'dropdown';
    value: string;
    choices: string[];
    name: string;

}

// Union type for the setting types
export type Setting = CheckboxSetting | DropdownSetting;

// Define the structure for all possible settings
export interface Settings {
    textSize: DropdownSetting;
    unitSelection: DropdownSetting;
    textColor: DropdownSetting;
    enabled: CheckboxSetting;
    testing: CheckboxSetting;
}

// Default values for settings
export const defaultSettings: Settings = {
    textSize: {
        type: 'dropdown',
        value: '2rem',
        choices: ['2.5rem', '2rem', '1.5rem', '1rem'],
        name: "Text Size"
    },
    unitSelection: {
        type: 'dropdown',
        value: 'metric',
        choices: ['metric', 'imperial'],
        name: "Unit"
    },
    textColor: {
        type: 'dropdown',
        value: 'white',
        choices: ['white', 'blue', 'aqua'],
        name: "Text Color"
    },
    enabled: {
        type: 'checkbox',
        value: true,
        name: "Extension Enabled"
    },
    testing: {
        type: 'checkbox',
        value: false,
        name: "Testing"
    },
};

// SettingsManager class
class SettingsManager {
    private settings: Settings;

    constructor() {
        // this.settings = defaultSettings;

        // this.loadSettings()
    }

    public getAllSettings(): Settings {
        return this.settings;
    }

    public async setSettings(settings: Settings) {
        this.settings
            = settings;
        return this.saveSettings()
    }

    public async saveSettings(): Promise<void> {
        // debounce(
        //     () => {
        console.log("saving settings", this.settings)

        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.set({"new-settings": this.settings}, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    console.log("Settings have been saved.", this.settings);
                    resolve();
                }
            });
        });
        // }
        // )()

    }


    public async loadSettings(): Promise<Settings> {
        return new Promise<Settings>((resolve, reject) => {
            chrome.storage.sync.get(['new-settings'], (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    this.settings = result['new-settings'] || defaultSettings;
                    console.log("Settings have been loaded.");
                    resolve(this.settings);
                }
            });
        });
    }

    public getSetting<K extends keyof Settings>(key: K): Settings[K] {
        return this.settings[key];
    }

    public updateSetting<K extends keyof Settings>(key: K, newValue: Settings[K]['value']): void {
        const setting = this.settings[key];
        if (setting && 'value' in setting) {
            console.log('updating settings', {key, newValue, oldValue: setting.value})
            setting.value = newValue;
            this.saveSettings().catch((error) => {
                console.error(`Failed to save the updated setting for ${key}:`, error);
            });
        } else {
            console.error(`Setting ${key} does not exist.`);
        }
    }
}

// Export a singleton instance of the SettingsManager
const settingsManager = new SettingsManager();
settingsManager.loadSettings().then(loaded => {
    console.log("initialized settings manager", loaded);
    recalcCSS();
})
export {settingsManager};
