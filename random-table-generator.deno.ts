import { randomStrFromRegexp } from "./random-str-from-regexp.deno.ts";

export type NumberColumn = {
  type: "number";
  range: {
    min: number;
    max: number;
  };
};

export type LiteralColumn = {
  type: "literal";
  values: string[];
};

export type RegExpColumn = {
  type: "regexp";
  regexp: RegExp;
};

export type StringColumn = {
  type: "string";
};

export type ConstantColumn = {
  type: "constant";
  value: string;
};

export type Column =
  | NumberColumn
  | LiteralColumn
  | RegExpColumn
  | StringColumn
  | ConstantColumn;
export type Columns = Record<string, Column>;

export const isNumberColumn = (
  column: Column
): column is NumberColumn => column.type === "number";
export const isLiteralColumn = (
  column: Column
): column is LiteralColumn => column.type === "literal";
export const isRegExpColumn = (
  column: Column
): column is RegExpColumn => column.type === "regexp";
export const isStringColumn = (
  column: Column
): column is StringColumn => column.type === "string";
export const isConstantColumn = (
  column: Column
): column is ConstantColumn => column.type === "constant";

export class RandomTableGenerator {
  private enumerateValueCombinations(
    record: Record<string, Array<string | number>>
  ): Array<Array<string>> {
    const keys = Object.keys(record);
    const result: Array<Array<string>> = [];

    const helper = (index: number, current: Array<string | number>) => {
      if (index === keys.length) {
        result.push([...current].map((value) => value.toString()));
        return;
      }

      const key = keys[index];
      record[key].forEach((value) => {
        current[index] = value;
        helper(index + 1, current);
      });
    };

    helper(0, []);
    return result;
  }

  generate(template: Columns): string[][] {
    const columnValues: Record<string, Array<string | number>> = {};

    const templateKeys = Object.keys(template);
    templateKeys.forEach((key) => {
      const column = template[key];

      if (isConstantColumn(column)) {
        columnValues[key] = [column.value];
      } else if (isNumberColumn(column)) {
        columnValues[key] = (() => {
          const values: number[] = [];
          for (let i = column.range.min; i <= column.range.max; i++) {
            values.push(i);
          }
          return values;
        })();
      } else if (isLiteralColumn(column)) {
        columnValues[key] = column.values;
      } else if (isRegExpColumn(column)) {
        const regexpText = column.regexp.toString().slice(1, -1);
        columnValues[key] = [];
        for (let i = 0; i < 10; i++) {
          columnValues[key].push(randomStrFromRegexp(regexpText));
        }
      } else if (isStringColumn(column)) {
        let string = "";
        for (let i = 0; i < 10; i++) {
          string += String.fromCodePoint(Math.floor(Math.random() * 0xff));
        }
        columnValues[key] = [string];
      }
    });
    
    console.log(columnValues);

    const combinations = this.enumerateValueCombinations(columnValues);
    return combinations;
  }
}
