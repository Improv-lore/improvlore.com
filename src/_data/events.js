import rawCalendar from "./rawCalendar.js";
import { transformCalendar } from "../../scripts/transformCalendar.js";
import fs from "fs/promises";

export default async function() {
  
  const transformed = await transformCalendar(await rawCalendar());
  const rawCustom = await fs.readFile('./custom.json', 'utf-8');
  const customData = JSON.parse(rawCustom);
  const finalData= transformed.concat(customData);
  return finalData;
}
