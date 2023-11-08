// Types for individual settings
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

export interface PositionAdjustSetting {
    type: 'positionAdjust';
    value: { isMoving: boolean; x: number; y: number };
    name: string;

}

// Union type for the setting types
export type Setting = CheckboxSetting | DropdownSetting | PositionAdjustSetting;

// Define the structure for all possible settings
export interface Settings {
    textSize: DropdownSetting;
    unitSelection: DropdownSetting;
    textColor: DropdownSetting;
    enabled: CheckboxSetting;
    testing: CheckboxSetting;
    adjustingPosition: PositionAdjustSetting;
}

// Default values for settings
const defaultSettings: Settings = {
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
    adjustingPosition: {
        type: 'positionAdjust',
        value: {isMoving: false, x: 0, y: 0},
        name: "Move"
    },
};

// SettingsManager class
class SettingsManager {
    private settings: Settings;

    constructor() {
        this.settings = defaultSettings;
    }

    public getAllSettings(): Settings {
        return this.settings;
    }

    public async saveSettings(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.set({settings: this.settings}, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    console.log("Settings have been saved.");
                    resolve();
                }
            });
        });
    }

    public async loadSettings(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.get(['settings'], (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    this.settings = result.settings || defaultSettings;
                    console.log("Settings have been loaded.");
                    resolve();
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
export {settingsManager};
