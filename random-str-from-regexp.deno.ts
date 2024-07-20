export function randomStrFromRegexp(regexpText: string): string {
  let result = "";

  let escaped = false;
  let inBrackets = false;
  let bracketStarts = 0;
  let inWave = false;
  let waveStarts = 0;

  regexpText.split("").forEach((char, i) => {
    console.log(`${char} ${escaped ? "escaped" : ""} ${inBrackets ? "inBrackets" : ""} ${inWave ? "inWave" : ""}`)
    if (!escaped && char === "\\") {
      escaped = true;
    } else {
      if (escaped) {
        result += char;
        escaped = false;
        return;
      }
      escaped = false;

      if (!inBrackets && !inWave && char === "[") {
        inBrackets = true;
        bracketStarts = i;
        return;
      } else if (inBrackets && !inWave) {
        if (char === "]") {
          inBrackets = false;
          const ableChars: string[] = [];
          const chars = regexpText.slice(bracketStarts + 1, i).split("");
          const patterns: string[] = [];
          for (let j = 0; j < chars.length; j++) {
            if (chars[j] === "-") {
              patterns.pop();
              patterns.push(chars.slice(j - 1, j + 2).join(""));
              j++;
            } else {
              patterns.push(chars[j]);
            }
          }

          for (const pattern of patterns) {
            if (pattern.length === 1) {
              ableChars.push(pattern);
            } else {
              const startCode = pattern.codePointAt(0);
              const endCode = pattern.codePointAt(pattern.length - 1);
              if (startCode !== undefined && endCode !== undefined) {
                for (let j = startCode; j <= endCode; j++) {
                  ableChars.push(String.fromCodePoint(j) ?? "");
                }
              }
            }
          }
          result += ableChars[Math.floor(Math.random() * ableChars.length)];
          return;
        }
        return;
      } else if (!inBrackets && !inWave && char === "{") {
        inWave = true;
        waveStarts = i;
        return;
      } else if (!inBrackets && inWave) {
        if (char === "}") {
          inWave = false;
          const times = regexpText.slice(waveStarts + 1, i);
          if (times.includes(",")) {
            const [min, max] = times.split(",").map(Number);
            result += result
              .charAt(result.length - 1)
              .repeat(min + Math.floor(Math.random() * (max - min + 1)) - 1);
          } else {
            result += result
              .charAt(result.length - 1)
              .repeat(Number(times) - 1);
          }
          return;
        }
        return;
      } else if (!inBrackets && !inWave && char === ".") {
        result += String.fromCodePoint(Math.floor(Math.random() * 0x10ffff));
        return;
      } else if (!inBrackets && !inWave && char === "+") {
        result += result
          .charAt(result.length - 1)
          .repeat(Math.floor(Math.random() * 10));
        return;
      } else if (!inBrackets && !inWave && char === "*") {
        if (Math.random() < 0.5) {
          result = result.slice(0, -1);
        } else {
          result += result
            .charAt(result.length - 1)
            .repeat(Math.floor(Math.random() * 10));
        }
        return;
      } else if (!inBrackets && !inWave && char === "?") {
        if (Math.random() < 0.5) {
          result = result.slice(0, -1);
        }
        return;
      } else {
        result += char;
        return;
      }
    }
  });

  return result;
}
