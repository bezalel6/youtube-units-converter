// export interface DragEventListener {
//     onDrag: (x: number, y: number) => void;
// }
//
// // Get the video and the element
// // Function to adjust the overlay position
//
//
// type E = HTMLElement;
//
// export function addDragListener(element: E, overlay: E, video: E, listener: DragEventListener) {
// //Make the DIV element draggagle:
// //     dragElement(document.getElementById("mydiv"));
//     const absPos = {x: 0, y: 0}
//     let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//     /* otherwise, move the DIV from anywhere inside the DIV:*/
//     element.onmousedown = dragMouseDown;
//
//     function dragMouseDown(e: MouseEvent) {
//         e = e || window.event;
//         e.preventDefault();
//         // get the mouse cursor position at startup:
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         document.onmouseup = closeDragElement;
//         // call a function whenever the cursor moves:
//         document.onmousemove = elementDrag;
//     }
//
//     function elementDrag(e: MouseEvent) {
//         e = e || window.event;
//         e.preventDefault();
//         // calculate the new cursor position:
//         pos1 = pos3 - e.clientX;
//         pos2 = pos4 - e.clientY;
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         // set the element's new position:
//         const x = (element.offsetLeft - pos1), y = (element.offsetTop - pos2);
//         element.style.top = y + "px";
//         element.style.left = x + "px";
//         absPos.x = x;
//         absPos.y = y;
//         listener.onDrag(x, y)
//
//     }
//
//     function closeDragElement() {
//         /* stop moving when mouse button is released:*/
//         document.onmouseup = null;
//         document.onmousemove = null;
//     }
//
// }


export interface DragEventListener {
    onDrag: (x: number, y: number) => void;
    // isDragEnabled: () => boolean;
}

type E = HTMLElement;

export function addDragListener(overlay: E, video: E, listener: DragEventListener) {
    const absPos = {x: 0, y: 0};
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    overlay.onmousedown = dragMouseDown;

    function dragMouseDown(e: MouseEvent) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        const x = (overlay.offsetLeft - pos1);
        const y = (overlay.offsetTop - pos2);
        absPos.x = x;
        absPos.y = y;
        // overlay.style.top = y + "px";
        // overlay.style.left = x + "px";

        // absPos.x = x / video.offsetWidth * video.clientWidth;
        // absPos.y = y / video.offsetHeight * video.clientHeight;
        listener.onDrag(absPos.x, absPos.y);
        adjustOverlay()
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    // Adjust overlay position when entering or exiting fullscreen
    function adjustOverlay() {
        // if (listener.isDragEnabled()) {
        // const scaleWidth = video.clientWidth / screen.width;
        // const scaleHeight = video.clientHeight / screen.height;
        // const newX = absPos.x * scaleWidth;
        // const newY = absPos.y * scaleHeight;
        overlay.style.left = `${absPos.x}px`;
        overlay.style.top = `${absPos.y}px`;
        // }
    }

    // Event listener for fullscreen change
    document.addEventListener('fullscreenchange', adjustOverlay);

    // Optional: Resize listener if the video size can change without fullscreen toggling
    window.addEventListener('resize', adjustOverlay);
}