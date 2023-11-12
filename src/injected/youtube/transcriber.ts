import {endsWithNum} from "../../util/utils";
import {Captions, RawCaption, RawCaptions, unitMapping, UnitMatch} from "./captions";
import {numberifyText} from "numberify-text";

const SERVER_URL = "https://function-1-uezwomtlfa-uc.a.run.app/?video_id=";

export async function getProcessedCaptions(videoId: string): Promise<Captions> {
    return transcribe(videoId).then(filter)
}

export async function transcribe(videoId: string): Promise<RawCaptions> {
    return fetch(SERVER_URL + videoId)
        .then((res) => res.json())
        .then((cap) => cap as RawCaptions);
}

export function filter(rawCaptions: RawCaptions): Captions {
    const captions: Captions = {captions: []};
    let lastLine: RawCaption | null = null;

    for (const caption of rawCaptions) {
        caption.text = numberifyText(caption.text, "en");

        for (const match of findUnits(caption.text)) {
            // console.log("match", match)
            if (shouldCombineWithPreviousLine(match, lastLine)) {
                const lastLineEndNumMatch = endsWithNum(lastLine!.text);
                if (lastLineEndNumMatch) {
                    const combinedText = buildCombinedText(lastLine!, caption, match, lastLineEndNumMatch);
                    pushCombinedCaption(captions, lastLine!, caption, match, lastLineEndNumMatch.foundNum, combinedText);
                    continue;
                }
            }

            handleRegularCase(captions, caption, match);
        }

        lastLine = caption;
    }

    return captions;
}

function shouldCombineWithPreviousLine(match: UnitMatch, lastLine: RawCaption | null): boolean {
    return match.quantity === undefined && lastLine !== null;
}

function buildCombinedText(lastLine: RawCaption, currentLine: RawCaption, match: UnitMatch, lastLineEndNumMatch: any): string {
    return lastLine.text.slice(lastLineEndNumMatch.numIndex) + " " + currentLine.text.slice(0, match.unit.length);
}

function pushCombinedCaption(captions: Captions, lastLine: RawCaption, currentLine: RawCaption, match: UnitMatch, amount: number, text: string): void {
    captions.captions.push({
        convertable: {unit: match.unitType, amount: amount},
        start: lastLine.start,
        duration: lastLine.duration + currentLine.duration,
        text: text,
        unitMatch: match,
    });
}

function handleRegularCase(captions: Captions, caption: RawCaption, match: UnitMatch): void {
    captions.captions.push({
        convertable: {unit: match.unitType, amount: match.quantity!},
        duration: caption.duration,
        start: caption.start,
        text: match.fullText,
        unitMatch: match,
    })
}

export function findUnits(text: string): UnitMatch[] {
    const results: UnitMatch[] = [];
    // Updated regex to include numbers with commas
    const regex = new RegExp(
        `(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?)*\\s*(${Object.keys(unitMapping).join("|")})\\b`,
        "ig"
    );

    const matches = text.matchAll(regex);
    for (const match of matches) {
        let currentlyAdding: UnitMatch;
        const unit = match[2].toLowerCase();
        if (match[1]) {
            currentlyAdding = {
                quantity: Number(match[1].replace(/,/g, '')),
                unit,
                fullText: `${match[1]}${unit}`,
                unitType: unitMapping[unit],
            };
        } else {
            currentlyAdding = {
                quantity: undefined,
                unit,
                unitType: unitMapping[unit],
                fullText: unit,
            };
        }
        results.push(currentlyAdding)
    }

    return results;
}


