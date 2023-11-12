import {Area, Length, Temperature} from "convert";

// export type UnitType = "Kilometer" | "Mile" | "Feet" | "Fahrenheit" | "Celsius";
export type UnitType = { t: Area | Length | Temperature; system: "imperial" | "metric" };


// export type ConvertTypes =
// type t = Unit;
export interface UnitMatch {
    unitType: UnitType;
    unit: string;
    quantity: number | undefined;
    fullText: string; // Full text of the quantity and unit

}

export const unitMapping: Record<string, UnitType> = {
    // Length units
    kilometer: {t: "kilometer", system: "metric"},
    kilometers: {t: "kilometer", system: "metric"},
    meter: {t: "meter", system: "metric"},
    meters: {t: "meter", system: "metric"},
    cm: {t: "centimeter", system: "metric"},
    centimeter: {t: "centimeter", system: "metric"},
    centimeters: {t: "centimeter", system: "metric"},
    mm: {t: "millimeter", system: "metric"},
    millimeter: {t: "millimeter", system: "metric"},
    millimeters: {t: "millimeter", system: "metric"},
    mile: {t: "mile", system: "imperial"},
    miles: {t: "mile", system: "imperial"},
    yd: {t: "yard", system: "imperial"},
    yard: {t: "yard", system: "imperial"},
    yards: {t: "yard", system: "imperial"},
    ft: {t: "foot", system: "imperial"},
    feet: {t: "foot", system: "imperial"},
    foot: {t: "foot", system: "imperial"},
    in: {t: "inch", system: "imperial"},
    inch: {t: "inch", system: "imperial"},
    inches: {t: "inch", system: "imperial"},

    // Area units
    sqkm: {t: "square kilometer", system: "metric"},
    "square kilometer": {t: "square kilometer", system: "metric"},
    "square kilometers": {t: "square kilometer", system: "metric"},
    sqm: {t: "square meter", system: "metric"},
    "square meter": {t: "square meter", system: "metric"},
    "square meters": {t: "square meter", system: "metric"},
    sqft: {t: "square foot", system: "imperial"},
    "square foot": {t: "square foot", system: "imperial"},
    "square feet": {t: "square foot", system: "imperial"},
    sqyd: {t: "square yard", system: "imperial"},
    "square yard": {t: "square yard", system: "imperial"},
    "square yards": {t: "square yard", system: "imperial"},
    sqin: {t: "square inch", system: "imperial"},
    "square inch": {t: "square inch", system: "imperial"},
    "square inches": {t: "square inch", system: "imperial"},
    acre: {t: "acre", system: "imperial"},
    acres: {t: "acre", system: "imperial"},
    hectare: {t: "hectare", system: "metric"},
    hectares: {t: "hectare", system: "metric"},

    // Temperature units
    c: {t: "celsius", system: "metric"},
    "degrees celsius": {t: "celsius", system: "metric"},
    celsius: {t: "celsius", system: "metric"},
    f: {t: "fahrenheit", system: "imperial"},
    "degrees fahrenheit": {t: "fahrenheit", system: "imperial"},
    fahrenheit: {t: "fahrenheit", system: "imperial"},
    k: {t: "kelvin", system: "metric"},
    kelvin: {t: "kelvin", system: "metric"},
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
