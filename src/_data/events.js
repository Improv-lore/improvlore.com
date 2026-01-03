import rawCalendar from "./rawCalendar.js";
import { transformCalendar } from "../../scripts/transformCalendar.js";
import fs from "fs";
import fsPromises from 'fs/promises';


export default async function() {
  const transformed = await transformCalendar(await rawCalendar());
  const rawCustom = await fsPromises.readFile('./custom.json',"utf8");
  const customData = JSON.parse(rawCustom);
  const finalData= transformed.concat(customData);
  return finalData;
}
