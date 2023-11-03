import convert from "convert";

export type UnitType = "Kilometer" | "Mile" | "Feet" | "Fahrenheit" | "Celsius";

export interface UnitMatch {
  unitType: UnitType;
  unit: string;
  position: number;
}

export const unitAllowedDividersMapping: Map<UnitType, string[]> = new Map([
  ["Kilometer", []],
  ["Mile", []],
  ["Fahrenheit", ["degrees", "degree"]],
  ["Celsius", ["degrees", "degree"]],
]);

export const unitMapping: Record<string, UnitType> = {
  km: "Kilometer",
  kilometer: "Kilometer",
  kilometers: "Kilometer",
  mile: "Mile",
  miles: "Mile",
  fahrenheit: "Fahrenheit",
  celsius: "Celsius",
  feet: "Feet",
  foot: "Feet",
  ft: "Feet",
};

export interface Convertable {
  unit: UnitType;
  amount: number;
}

export interface CaptionSegment {
  start: number;
  duration: number;
  text: string;
  unitMatch: UnitMatch;
  convertable: Convertable;
  // captionedUnit: UnitType;
}
// export type Transformer = ()
export interface Captions {
  captions: CaptionSegment[];
}
export interface RawCaption {
  start: number;
  duration: number;
  text: string;
}
export type RawCaptions = RawCaption[];
