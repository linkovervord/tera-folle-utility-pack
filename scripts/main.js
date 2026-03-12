import { openPortraitSelector } from "../macros/openPortraitSelector.js";
import { MODULE_ID } from "./constants.js";

Hooks.once("ready", async () => {
  game.modules.get(MODULE_ID).api = {
    openPortraitSelector
  };
});
