import {filter} from "../src/injected/youtube/transcriber";
import {RawCaptions} from "../src/injected/youtube/captions";

function mockCaptions(...strs: string[]): RawCaptions {
    return strs.map(s => ({start: 4, text: s, duration: 4}));
}

describe("basic recognition functionality", () => {
    it("recognize 500ft", () => {
        const filtered = filter(mockCaptions("hello this is 500 ft"))
        expect(filtered.captions[0]).toBeDefined();
        expect(filtered.captions[0].convertable).toEqual({unit: {t: "foot", system: "imperial"}, amount: 500})
    })
    // it("recognize when number is split between two lines")
});
// describe("")