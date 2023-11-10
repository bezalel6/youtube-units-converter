/**
 * i am adding optional divider options that will be allowed to be between the numbers and the end of the str. here is an example use case:
 i want to detect sentences in this manner:
 "wow! its so hot in here! its like 100 degrees celsius"
 the celsius will be found, and the string will be cut all the way up to it. so this is whats left
 "wow! its so hot in here! its like 100 degrees"
 what i used to do, is check if the sentence ended in a number, that way i could tell if the word detected is related to the number that was before it. but that will clearly fail in this case, since "degrees" is the last word and not the number. which is why i want to add the option to have dividers that will be allowed. so in this case, what will be forwarded to the function will be these args:
 endsWithNum("wow! its so hot in here! its like 100 degrees", ["degrees","degree"])
 */

export const endsWithNum = (
    str: string,
    allowedDividers: string[] = []
): { foundNum: number, numIndex: number } | null => {
    let reg = "([0-9]+)\\s*";
    if (allowedDividers.length) {
        reg += `(?:${allowedDividers.join("|")})?`;
    }
    reg += "\\s*$";
    const regex = new RegExp(reg, "gm");
    //   let match;

    //   while ((match = regex.exec(str)) !== null) {
    //     console.log(match);
    //     // Each call to exec() returns the next match in the format above
    //     // and advances regexG.lastIndex
    //   }
    const m = regex.exec(str);
    if (m) {
        const num = Number(m[1]);
        // console.log("returning", num, "for", str);
        // if (Number.isNaN(num)) {
        //   debugger;
        // }
        return {foundNum: num, numIndex: m.index}
    }
    return null;
};

export function debounce(func: Function, wait: number = 500) {
    let timeout: number | undefined;

    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = window.setTimeout(later, wait);
    };
};

// Usage
// const callback = () => {
//     console.log('Callback is called!');
// };
//
// const debouncedCallback = debounce(callback, 500);
export function shallowEqual(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Create sets of keys for each object
    const setKeys1 = new Set(keys1);
    const setKeys2 = new Set(keys2);

    // Check if both objects have the same set of keys
    if (setKeys1.size !== setKeys2.size) {
        return false;
    }

    // Check if all keys in obj1 have the same value in obj2
    return keys1.every((key) => obj2.hasOwnProperty(key));
}
