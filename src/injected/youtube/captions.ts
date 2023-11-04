import convert, { Area, Length, Temperature } from "convert";

// export type UnitType = "Kilometer" | "Mile" | "Feet" | "Fahrenheit" | "Celsius";
export type UnitType = Area | Length | Temperature;

// export type ConvertTypes =
// type t = Unit;
export interface UnitMatch {
  unitType: UnitType;
  unit: string;
  position: number;
}

export const unitAllowedDividersMapping: Map<UnitType, string[]> = new Map([
  // ["Kilometer", []],
  // ["Mile", []],
  // ["Fahrenheit", ["degrees", "degree"]],
  // ["Celsius", ["degrees", "degree"]],
]);
export const unitMapping: Record<string, UnitType> = {
  // Length units
  km: "kilometer",
  kilometer: "kilometer",
  kilometers: "kilometer",
  m: "meter",
  meter: "meter",
  meters: "meter",
  cm: "centimeter",
  centimeter: "centimeter",
  centimeters: "centimeter",
  mm: "millimeter",
  millimeter: "millimeter",
  millimeters: "millimeter",
  mile: "mile",
  miles: "mile",
  yd: "yard",
  yard: "yard",
  yards: "yard",
  ft: "foot",
  feet: "foot",
  foot: "foot",
  in: "inch",
  inch: "inch",
  inches: "inch",

  // Area units
  sqkm: "square kilometer",
  sqm: "square meter",
  sqft: "square foot",
  sqyd: "square yard",
  sqin: "square inch",
  acre: "acre",
  hectares: "hectare",

  // Temperature units
  c: "celsius",
  celsius: "celsius",
  f: "fahrenheit",
  fahrenheit: "fahrenheit",
  k: "kelvin",
  kelvin: "kelvin",

  // Add more units as needed
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
