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

export const SettingsManager = {
  enabled: {
    type: "checkbox" as const,
    value: true,
    id: "enabled",
    name: "Enabled",
  },
  darkMode: {
    type: "checkbox" as const,
    value: true,
    id: "dark-mode",
    name: "Enabled",
  },
};

// // type Option<T> = T extends boolean ?// Create function overloads
// function createOption(option: Checkbox): void;
// function createOption(option: Dropdown): void;

// // Implement the function with a generic parameter
// function createOption(option: Setting) {}
// // function createOption<T>(option: Option<T>) {}
// createOption(SettingsManager.d);
