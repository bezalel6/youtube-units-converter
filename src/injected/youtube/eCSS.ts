import {Settings} from "../../util/settings";

type CSS = string;

// was this whole file a mistake? you betcha 😎
export interface cssProps {
    settings: Settings;
    isMovingOverlay: boolean;
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

export function setCSS({settings, isMovingOverlay}: cssProps): CSS {
    console.log("setting css with settings", settings)
    let css = "";
    css += `.text-background:not(:empty) {
  background: rgba(0, 0, 0, 0.7); /* Black background with opacity */
  /*  DELETED color: white;  White text color */
  padding: 4px 8px; /* Some padding around the text */
  border-radius: 4px; /* Rounded corners */
  display: inline;
  line-height: 1.6; /* Adjust line height to prevent overlap */
  text-wrap:pretty;
}
`;
    const overlay = new CSSBuilder(`#${CONSTS.overlay}`)
        .s("position", "absolute")
        .s("top", "0")
        .s("left", "0")
        .s("direction", "ltr")
        .s("webkitTextStroke", "3px black")
        .s("display", settings.enabled.value ? "inline" : "none")
        .s("alignItems", "center")
        .s(
            "color",
            settings.textColor.value
        ).s("width", CONSTS.popupWidth)
        .s("textWrap", "pretty")
        .s("zIndex", "100")
        .build();

    css += overlay;
    css += new CSSBuilder(`#${CONSTS.overlayText}`)
        .s(
            "fontSize",
            settings.textSize.value,
            true
        ).s("direction", "ltr")
        .s("userSelect", "none")
        // .s("textShadow", "12px -9px 3px rgba(0, 0, 0, 0.5)")

        .s("textAlign", "center")
        .s("width", "100%")
        .s("border", isMovingOverlay ? "3px dashed red" : "none")
        .build();
    //   console.log("css", css);
    injectCSS(css);
    return css;
}

export enum CONSTS {
    overlay = "custom-overlay",
    overlayText = "overlay-text",
    customCSS = "custom-css",
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
