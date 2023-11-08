import {Settings} from "../../util/settings";

type CSS = string;

export interface cssProps {
    settings: Settings;
}

const injectCSS = (css: string) => {
    let el = document.querySelector(`#${CONSTS.customCSS}`) as HTMLStyleElement;
    let add = !el;
    if (add) {
        el = document.createElement("style");
        el.id = CONSTS.customCSS;
    }
    el.type = "text/css";
    el.innerText = css;
    if (add) document.head.appendChild(el);
    return el;
};

export function setCSS({settings}: cssProps): CSS {
    let css = "";
    const overlay = new CSSBuilder(`#${CONSTS.overlay}`)
        .s("position", "absolute")
        .s("top", "0")
        .s("left", "0")
        .s("direction", "ltr")
        .s("webkitTextStroke", "3px black")
        .s("display", settings.enabled.value ? "flex" : "none")
        .s("alignItems", "center")
        .s(
            "color",
            settings.textColor.value.choices[settings.textColor.value.selected]
        ).s("width", CONSTS.popupWidth)
        .s("textWrap", "pretty")
        .s("zIndex", "100")
        .build();
    const moveSave = new CSSBuilder(`#${CONSTS.movementSaveBtn}`)
        .s("display", settings.adjustingPosition.value.isMoving ? "block" : "none")
    css += moveSave.build();
    css += overlay;
    css += new CSSBuilder(`#${CONSTS.overlayText}`)
        .s(
            "fontSize",
            settings.textSize.value.choices[settings.textSize.value.selected],
            true
        ).s("direction", "ltr")
        .s("userSelect", "none")
        .s("textShadow", "12px -9px 3px rgba(0, 0, 0, 0.5)")
        .s("textAlign", "center")
        .s("width", "100%")
        .s("border", settings.adjustingPosition.value.isMoving ? "3px dashed red" : "none")
        .build();
    //   console.log("css", css);
    injectCSS(css);
    return css;
}

export enum CONSTS {
    overlay = "custom-overlay",
    overlayText = "overlay-text",
    customCSS = "custom-css",
    movementSaveBtn = "move-save",
    popupWidth = "350px",
}

type CSSProperties = {
    [key: string]: string | number;
};

class CSSBuilder {
    private styles: CSSProperties = {};

    constructor(selector: string) {
        this.styles.selector = selector;
        this.styles.rules = "";
    }

    s(property: string, value: string, important: boolean = false): CSSBuilder {
        this.styles[property] = value + (important ? " !important" : "");
        return this;
    }

    build(): string {
        let cssString = `${this.styles.selector} { `;
        for (const [property, value] of Object.entries(this.styles)) {
            if (property !== "selector") {
                cssString += `${this.camelToKebabCase(property)}: ${value}; `;
            }
        }
        cssString += "}";
        return cssString;
    }

    private camelToKebabCase(str: string): string {
        return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    }
}

// Usage
// const css = new CSSBuilder(".myClass")
//   .set("backgroundColor", "blue")
//   .set("color", "white")
//   .set("fontSize", "14px")
//   .build();

// console.log(css);
