import {endsWithNum} from "../../util/utils";
import {Captions, RawCaption, RawCaptions, unitMapping, UnitMatch,} from "./captions";
import {numberifyText} from "numberify-text";
// import { err } from "./logger";
const SERVER_URL = "https://function-1-uezwomtlfa-uc.a.run.app/?video_id=";

// const SERVER_URL = "http://localhost:3000/transcript/";

export async function transcribe(videoId: string): Promise<Captions> {
    return fetch(SERVER_URL + videoId)
        .then((res) => res.json())
        .then((cap) => {
            return filter(cap as RawCaptions);
        })
}

export function filter(rawCaptions: RawCaptions) {
    const captions: Captions = {
        captions: [],
    };
    let lastLine: RawCaption | null = null;
    for (const caption of rawCaptions) {
        caption.text = numberifyText(caption.text, "en");

        for (const match of findUnits(caption.text)) {
            let isLastLinePossible = match.position === 0 && lastLine
            let fullText = caption.text;
            if (isLastLinePossible) {
                const lastLineEndNumMatch = endsWithNum(lastLine!.text)

                if (lastLineEndNumMatch) {
                    fullText = ((lastLine!.text).slice(lastLineEndNumMatch.numIndex) + " " + (caption.text).slice(0, match.unit.length))
                    // alert("actually found new line divider. full built text: " + fullText)
                    captions.captions.push({
                        convertable: {
                            unit: match.unitType,
                            amount: lastLineEndNumMatch.foundNum,
                        },
                        start: lastLine!.start,
                        duration: lastLine!.duration + caption.duration,
                        text: fullText,
                        unitMatch: match,
                    });
                    continue;
                }
            }
            //this is actually ok, because the last line text already got replaced
            caption.text = caption.text.replace(/,/g, "");

            // let txt = caption.text.slice(caption.start,)
            /** covering edge case of:
             *
             *  kjkjkjk 50->new line->kilometers
             *
             */
                // if (
                //     match.position === 0 &&
                //     lastLine &&
                //     endsWithNum(lastLine.text, divider) !== null
                // ) {
                //     captions.captions.push({
                //         convertable: {
                //             unit: match.unitType,
                //             amount: endsWithNum(lastLine.text, divider)!,
                //         },
                //         start: lastLine.start,
                //         duration: lastLine.duration + caption.duration,
                //         text: caption.text,
                //         unitMatch: match,
                //     });
                //     continue;
                // }
            const sliceBeforeUnit = caption.text.slice(0, match.position - 1);
            const num = endsWithNum(sliceBeforeUnit);
            if (num !== null) {
                captions.captions.push({
                    convertable: {unit: match.unitType, amount: num.foundNum},
                    duration: caption.duration,
                    start: caption.start,
                    text: caption.text.slice(num.numIndex, match.position + match.unit.length),
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

    const matches = text.matchAll(regex);
    for (const match of matches) {
        // console.log(match);
        const unit = match[1].toLowerCase();
        results.push({unitType: unitMapping[unit], unit, position: match.index!});
    }

    return results;
}