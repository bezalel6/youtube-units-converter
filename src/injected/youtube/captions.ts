import convert from "convert";

export type UnitType = "Kilometer" | "Mile";

export interface UnitMatch {
  unitType: UnitType;
  unit: string;
  position: number;
}

export const unitMapping: Record<string, UnitType> = {
  km: "Kilometer",
  kilometer: "Kilometer",
  kilometers: "Kilometer",
  mile: "Mile",
  miles: "Mile",
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
  captionedUnit: UnitType;
}

export interface Captions {
  captions: CaptionSegment[];
}
export interface RawCaption {
  start: number;
  duration: number;
  text: string;
}
export type RawCaptions = RawCaption[];
