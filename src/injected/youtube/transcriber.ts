import convert, { Length } from "convert";
import { endsWithNum } from "../../util/utils";
import {
  Captions,
  RawCaption,
  RawCaptions,
  UnitMatch,
  unitAllowedDividersMapping,
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
      console.log(match);
      const divider = unitAllowedDividersMapping.get(match.unitType);
      caption.text = caption.text.replace(/,/g, "");
      /** covering edge case of:
       *
       *  kjkjkjk 50->kilometers
       *
       */
      if (
        match.position === 0 &&
        lastLine &&
        endsWithNum(lastLine.text, divider) !== null
      ) {
        captions.captions.push({
          convertable: {
            unit: match.unitType,
            amount: endsWithNum(lastLine.text, divider)!,
          },
          start: lastLine.start,
          duration: lastLine.duration + caption.duration,
          text: caption.text,
          unitMatch: match,
        });
        continue;
      }
      //   console.log("slicing", caption);
      const sliceBeforeUnit = caption.text.slice(0, match.position);
      //   console.log("sliced:", sliceBeforeUnit);
      const num = endsWithNum(sliceBeforeUnit, divider);
      if (num !== null) {
        captions.captions.push({
          convertable: { unit: match.unitType, amount: num },
          duration: caption.duration,
          start: caption.start,
          text: caption.text,
          unitMatch: match,
        });
      }
    }
    lastLine = caption;
  }

  return transform(captions);
}
function transform(captions: Captions): Captions {
  for (const caption of captions.captions) {
    caption.text = convert(
      caption.convertable.amount,
      caption.convertable.unit as any
    )
      .to("best", "metric")
      .toString(0);
    // if (caption.convertable.unit === "miles") {
    //   caption.text = convert(caption.convertable.amount, "miles")
    //     .to("best", "metric")
    //     .toString(0);
    // } else if (caption.convertable.unit === "Fahrenheit") {
    //   caption.text = convert(caption.convertable.amount, "fahrenheit")
    //     .to("best", "metric")
    //     .toString(0);
    // } else if (caption.convertable.unit === "Feet") {
    //   caption.text = convert(caption.convertable.amount, "feet")
    //     .to("best", "metric")
    //     .toString(0);
    // }
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
    console.log(match);
    const unit = match[1].toLowerCase();
    results.push({ unitType: unitMapping[unit], unit, position: match.index! });
  }

  return results;
}

// Usage:
// const text = "The distance is 5 kilometers, or alternatively 3.1 miles.";
// const results = findUnits(text);
// for (const result of results) {
//   console.log(
//     `Unit Type: ${result.unitType}, Unit: ${result.unit}, Position: ${result.position}`
//   );
// }
