import {filter, findUnits, transcribe} from "../src/injected/youtube/transcriber";
import {RawCaptions} from "../src/injected/youtube/captions";
import testingCaptions from './testingVidCaptions.json'
import "isomorphic-fetch"

function mockCaptions(...strs: string[]): RawCaptions {
    return strs.map(s => ({start: 4, text: s, duration: 4}));
}

function testFilter(amount: number = 500, ...strs: string[]) {
    const filtered = filter(mockCaptions(...strs))
    expect(filtered.captions[0]).toBeDefined();
    expect(filtered.captions[0].convertable).toEqual({unit: {t: "foot", system: "imperial"}, amount})
}

describe("basic recognition functionality", () => {
    it("recognize 500ft", () => {
        testFilter(500, "hello this is 500 ft")
    })
    it("find the lonely unit", () => {
        const lonely = findUnits('ft')
        expect(lonely).not.toEqual([]);
        expect(lonely).toEqual([{
            quantity: undefined, unit: 'ft',
            unitType: {t: 'foot', system: 'imperial'},
            fullText: 'ft'
        }])
    })
    it("recognize when number is split between two lines", () => {
        testFilter(500, "hello this is 500", 'ft');
    })
    it("digits in text", () => {
        testFilter(500, "hello this is five hundred", 'ft')
    })
});

const testingID = "dQw4w9WgXcQ"

describe("server connection and functionality", () => {
    it("sane checking captions", async () => {
        const got = await transcribe(testingID);
        expect(got).toEqual(testingCaptions);
    })
})