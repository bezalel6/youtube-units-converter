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
    overlay.innerHTML = "<h1>Hello World</h1>";

    // Append overlay to video element
    videoElement.appendChild(overlay);
    return true;
  }
  return false;
}

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
