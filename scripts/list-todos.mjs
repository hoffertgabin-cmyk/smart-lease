#!/usr/bin/env node
// Lists the open questions stored in src/content/vehicles.json (the `todo` field of each vehicle).
import { readFile } from "node:fs/promises";

const data = JSON.parse(await readFile(new URL("../src/content/vehicles.json", import.meta.url), "utf8"));
let count = 0;
for (const v of data.vehicles) {
  if (!v.todo?.length) continue;
  console.log(`\n${v.brand} ${v.model} ${v.version} (${v.slug})`);
  for (const t of v.todo) console.log(`  - ${t}`);
  count += v.todo.length;
}
console.log(`\n${count} point(s) à vérifier.`);
