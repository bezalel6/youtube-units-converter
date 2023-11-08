import {getSettings, SettingsManager, updateSettings} from "../../util/settings";
import {Captions, Convertable} from "./captions";
import {CONSTS, setCSS} from "./eCSS";
import {addDragListener} from "../../util/MouseDragListener";


export function setText(str: string) {
    // console.log("text set to", str);

    (
        document.querySelector(`#${CONSTS.overlayText}`) as HTMLDivElement
    ).innerText = str;
}

export function isOverlayAdded() {
    return !!document.querySelector(`#${CONSTS.overlay}`);
}

// Function to create the overlay
export function createOverlay() {
    // Get the video element

    const videoElement = document.querySelector(".html5-video-player") as HTMLElement;
    if (isOverlayAdded()) {
        console.error("trying to create overlay when one exists");
    } else if (videoElement) {
        // Create overlay element
        const overlay = document.createElement("div");
        overlay.id = `${CONSTS.overlay}`;

        overlay.innerHTML = `<h1 id="${CONSTS.overlayText}"></h1>`;
        // Append overlay to video element
        videoElement.appendChild(overlay);
        updateSettings();
        addDragListener(overlay, videoElement, {onDrag: console.log})
        return true;
    }
    return false;
}

export function recalcCSS() {

    setCSS({settings: SettingsManager});
}

const scheduledCallbacks: Array<ScheduledCallback> = [];

export function captionsSetup(captions: Captions) {
    captions.captions.forEach((c) => {

        scheduledCallbacks.push({
            convertable: c.convertable,
            text: c.text,
            time: c.start,
            duration: c.duration,
        });
        console.log("scheduled @ ", c.start);
    });
    setupTimeUpdateCallback();
}

const TTL = 2;

interface ScheduledCallback {
    //schedule for video time (in seconds)
    time: number;
    text: string;
    duration: number;
    convertable: Convertable;
    // ttl: number;
}

export async function makeConvertable(convertable: Convertable, metric: boolean) {
    return import('convert').then(({convert}) => {

        return convertable.amount + " " + convertable.unit + " = " + convert(convertable.amount, convertable.unit as any).to("best", metric ? "metric" : "imperial").toString(0)
    })
}

function onTimeUpdate() {
    const videoElement = document.querySelector("video")!;

    async function asyncF() {

        let str = "";
        for (const scheduled of scheduledCallbacks) {
            const diff = videoElement.currentTime - scheduled.time;
            if (diff >= 0 && diff < Math.max(TTL, scheduled.duration)) {
                // const txt = convertUnit(scheduled.convertable, await getSettings());
                const settings = (await getSettings());
                const txt = await makeConvertable(scheduled.convertable, settings.unitSelection.value.choices[settings.unitSelection.value.selected] === "metric");
                // const txt = "fuck its the settings manager"
                console.log("running ", txt);
                if (str.length) str += "\n";

                str += txt;
            }
        }
        // console.log("done calling callbacks. str is", str)
        if (!str.length) {
            if (SettingsManager.testing.value) {
                setText("testing testing 123");
            } else {
                setText("");
            }
        } else setText(str);
    }

    asyncF()
}

/**
 * run callback when video reaches time
 * @param time in seconds
 * @param callback
 *
 */
function setupTimeUpdateCallback() {
    console.log("setting time update callback")
    // Get the underlying video element
    const videoElement = document.querySelector("video");
    if (videoElement) {
        videoElement.removeEventListener("timeupdate", onTimeUpdate);
        // Set up the timeupdate event listener
        videoElement.addEventListener("timeupdate", onTimeUpdate);
    }
}

// // Usage:
// setupTimeUpdateCallback(10, function () {
//   console.log("Video has reached 10 seconds");
// });

// Create a MutationObserver to wait for the video player to load
const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            if (createOverlay()) {
                // Disconnect the observer to prevent further mutations
                observer.disconnect();
            }
        }
    }
});

// Start observing the document with configured parameters
observer.observe(document, {childList: true, subtree: true});
