export function getPositionRatios(x: number, y: number, videoElement: HTMLElement): { xRatio: number, yRatio: number } {
    return {
        xRatio: x / videoElement.clientWidth,
        yRatio: y / videoElement.clientHeight
    };
}

export function convertToFullscreen(xRatio: number, yRatio: number): { x: number, y: number } {
    return {
        x: xRatio * fullWinSize.width,
        y: yRatio * fullWinSize.height
    };
}

export function convertFromFullscreen(x: number, y: number, videoElement: HTMLElement): { currentX: number, currentY: number } {
    let xRatio = x / window.innerWidth;
    let yRatio = y / window.innerHeight;

    return {
        currentX: xRatio * videoElement.clientWidth,
        currentY: yRatio * videoElement.clientHeight
    };
}

const fullWinSize = {
    width: 1920,
    height: 1080,
}


