import { RandomTableGenerator } from "./random-table-generator.deno.ts";

const templateJsonFileName = Deno.args[0];
const templateJson = await Deno.readTextFile(templateJsonFileName);
const template = JSON.parse(templateJson);

// deno-lint-ignore no-explicit-any
Object.entries(template).forEach(([key, value]: [string, any]) => {
  if (value.type === "regexp") {
    template[key] = { type: "regexp", regexp: new RegExp(value.regexp) };
  }
});
console.log(JSON.stringify(template, null, 2));

const generator = new RandomTableGenerator();

const csv = generator.generate(template);

await Deno.writeTextFile("output.csv", csv.join("\n"));
