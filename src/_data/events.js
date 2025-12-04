import rawCalendar from "./rawCalendar.js";
import { transformCalendar } from "../../scripts/transformCalendar.js";
import fs from "fs";

export default async function() {
  const transformed = await transformCalendar(await rawCalendar());
  let currentDataString = "";
  if (fs.existsSync("output.json")) {
    currentDataString = fs.readFileSync('output.json', "utf8");
  }
  if (currentDataString !== transformed) {
  console.log("Data changed. Updating output.json...");
  // write local file
  fs.writeFileSync("output.json", JSON.stringify(transformed, null, 4));
  } else {
    console.log("Data unchanged. No update needed.");
  }
  return transformed;
}
