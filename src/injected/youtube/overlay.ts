import {SettingsManager, updateSettings} from "../../util/settings";
import {Captions} from "./captions";
import {CONSTS, setCSS} from "./eCSS";
import {addDragListener} from "../../util/MouseDragListener";

export function setText(str: string) {
    // console.log("text set to", str, "caller", arguments.callee.caller.name);

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
    // ttl: number;
}

function onTimeUpdate() {
    const videoElement = document.querySelector("video")!;

    let str = "";
    scheduledCallbacks.forEach((scheduled) => {
        const diff = videoElement.currentTime - scheduled.time;
        if (diff >= 0 && diff < Math.max(TTL, scheduled.duration)) {
            console.log("running ", scheduled.text);

            if (str.length) str += "\n";
            str += scheduled.text;
        }
        // else {
        //   setText("");
        // }
        // Remove the event listener to ensure the callback is only called once
        // videoElement.removeEventListener("timeupdate", onTimeUpdate);
        // Call the callback
        // callback();
    });
    if (!str.length) {
        if (SettingsManager.testing.value) {
            setText("testing testing 123");
        } else {
            setText("");
        }
    } else setText(str);
}

/**
 * run callback when video reaches time
 * @param time in seconds
 * @param callback
 *
 */
function setupTimeUpdateCallback() {
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
