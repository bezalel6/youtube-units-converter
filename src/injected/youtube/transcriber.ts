import { endsWithNum } from "../../util/utils";
import {
  Captions,
  RawCaption,
  RawCaptions,
  UnitMatch,
  unitMapping,
} from "./captions";
import { numberifyText } from "numberify-text";
const SERVER_URL = "http://localhost:3000/transcript/";

export async function transcribe(videoId: string): Promise<Captions> {
  return fetch(SERVER_URL + videoId)
    .then((res) => res.json())
    .then((cap) => {
      return filter(cap as RawCaptions);
    });
}

export function filter(rawCaptions: RawCaptions) {
  const captions: Captions = {
    captions: [],
  };
  let lastLine: RawCaption | null = null;
  for (const caption of rawCaptions) {
    caption.text = numberifyText(caption.text, "en");
    for (const match of findUnits(caption.text)) {
      /** covering edge case of:
       *
       *  kjkjkjk 50->kilometers
       *
       */
      if (
        match.position === 0 &&
        lastLine &&
        endsWithNum(lastLine.text) !== null
      ) {
        captions.captions.push({
          captionedUnit: match.unitType,
          start: lastLine.start,
          duration: lastLine.duration + caption.duration,
          text: caption.text,
          unitMatch: match,
        });
        continue;
      }
      const sliceBeforeUnit = caption.text.slice(0, match.position);
      const num = endsWithNum(sliceBeforeUnit);
      if (num !== null) {
        captions.captions.push({
          captionedUnit: match.unitType,
          duration: caption.duration,
          start: caption.start,
          text: caption.text,
          unitMatch: match,
        });
      }
    }
    lastLine = caption;
  }
  return captions;
}

export function findUnits(text: string): UnitMatch[] {
  const results: UnitMatch[] = [];
  const regex = new RegExp(
    `\\b(${Object.keys(unitMapping).join("|")})\\b`,
    "ig"
  );

  for (const match of text.matchAll(regex)) {
    const unit = match[1].toLowerCase();
    results.push({ unitType: unitMapping[unit], unit, position: match.index! });
  }

  return results;
}

// Usage:
const text = "The distance is 5 kilometers, or alternatively 3.1 miles.";
const results = findUnits(text);
for (const result of results) {
  console.log(
    `Unit Type: ${result.unitType}, Unit: ${result.unit}, Position: ${result.position}`
  );
}
