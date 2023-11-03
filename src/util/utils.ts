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
): number | null => {
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
    console.log("returning", num, "for", str);
    // if (Number.isNaN(num)) {
    //   debugger;
    // }
    return num;
  }
  return null;
};
