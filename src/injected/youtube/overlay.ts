import { Captions } from "./captions";

const txtId = "my-txt";

function setText(str: string) {
  (document.querySelector(`#${txtId}`) as HTMLDivElement).innerText = str;
}

// Function to create the overlay
export function createOverlay() {
  // Get the video element
  const videoElement = document.querySelector(".html5-video-player");
  if (videoElement) {
    // Create overlay element
    const overlay = document.createElement("div");
    overlay.id = "custom-overlay";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.fontSize = "4rem";
    overlay.style.color = "white";
    overlay.style.zIndex = "100";
    overlay.style.pointerEvents = "none";
    overlay.innerHTML = `<h1 id="${txtId}"></h1>`;

    // Append overlay to video element
    videoElement.appendChild(overlay);
    return true;
  }
  return false;
}
const scheduledCallbacks: Array<ScheduledCallback> = [];
export function captionsSetup(captions: Captions) {
  captions.captions.forEach((c) => {
    scheduledCallbacks.push({
      text: c.text,
      time: c.start,
    });
    console.log("scheduled @ ", c.start);
  });
}
const TTL = 2;
interface ScheduledCallback {
  //schedule for video time (in seconds)
  time: number;
  text: string;
  // ttl: number;
}
function onTimeUpdate() {
  const videoElement = document.querySelector("video")!;

  scheduledCallbacks.forEach((scheduled) => {
    const diff = videoElement.currentTime - scheduled.time;
    if (diff >= 0 && diff < TTL) setText(scheduled.text);
    else setText("");
    // Remove the event listener to ensure the callback is only called once
    // videoElement.removeEventListener("timeupdate", onTimeUpdate);
    // Call the callback
    // callback();
  });
}
/**
 * run callback when video reaches time
 * @param time in seconds
 * @param callback
 *
 */
function setupTimeUpdateCallback(time: number, callback: () => void) {
  // Get the underlying video element
  const videoElement = document.querySelector("video");
  if (videoElement) {
    videoElement.removeEventListener("timeupdate", onTimeUpdate);
    // Set up the timeupdate event listener
    videoElement.addEventListener("timeupdate", onTimeUpdate);
  }
  //   if (videoElement.currentTime >= time) {
  //     // Remove the event listener to ensure the callback is only called once
  //     videoElement.removeEventListener("timeupdate", onTimeUpdate);
  //     // Call the callback
  //     callback();
  //   }
}

// Usage:
setupTimeUpdateCallback(10, function () {
  console.log("Video has reached 10 seconds");
});

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
observer.observe(document, { childList: true, subtree: true });
