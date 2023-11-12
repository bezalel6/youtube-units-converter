export interface DragEventListener {
    onDrag: (x: number, y: number) => void;
}

type E = HTMLElement;

export function addDragListener(overlay: E, video: E, listener: DragEventListener) {
    let x = 0, y = 0;
    overlay.onmousedown = dragMouseDown;

    function dragMouseDown(e: MouseEvent) {
        e.preventDefault();
        x = e.clientX;
        y = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
        e.preventDefault();
        const deltaX = e.clientX - x;
        const deltaY = e.clientY - y;
        x = e.clientX;
        y = e.clientY;

        const newX = overlay.offsetLeft + deltaX;
        const newY = overlay.offsetTop + deltaY;

        overlay.style.left = `${newX}px`;
        overlay.style.top = `${newY}px`;

        listener.onDrag(newX, newY);
        updateCurrentPosRatio()
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function repositionOverlay() {
        const videoRect = video.getBoundingClientRect();
        overlay.style.left = `${videoRect.left + videoRect.width * currentRatio.xRatio}px`;
        overlay.style.top = `${videoRect.top + videoRect.height * currentRatio.yRatio}px`;
        updateCurrentPosRatio()
    }

    type PositionRatios = {
        xRatio: number;
        yRatio: number;
    };

    
    let currentRatio: PositionRatios = {xRatio: 0, yRatio: 0};

    function updateCurrentPosRatio() {
        currentRatio = calculatePositionRatios(overlay, video);

        function calculatePositionRatios(element: E, video: E): PositionRatios {
            const videoRect = video.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            return {
                xRatio: (elementRect.left - videoRect.left) / videoRect.width,
                yRatio: (elementRect.top - videoRect.top) / videoRect.height
            };
        }
    }


    window.addEventListener('resize', repositionOverlay);
    document.addEventListener('fullscreenchange', repositionOverlay);
    video.addEventListener('loadedmetadata', updateCurrentPosRatio);
}

