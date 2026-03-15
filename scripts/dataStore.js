import { portraitSelectorExampleStructure } from "../macros/data/openPortraitSelectorDataStructure.js";
import { MODULE_ID } from "./constants.js";

export async function savePortraitSelectorData(data) {
  await game.settings.set(
    MODULE_ID,
    "portraitSelectorData",
    data
  );
}

export function getPortraitSelectorData() {
  return game.settings.get(
    MODULE_ID,
    "portraitSelectorData"
  ) ?? portraitSelectorExampleStructure;
}