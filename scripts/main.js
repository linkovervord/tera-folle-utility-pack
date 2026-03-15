import { portraitSelectorExampleStructure } from "../macros/data/openPortraitSelectorDataStructure.js";
import { PortraitSelector } from "../macros/portraitSelector.js";
import { PortraitSelectorManager } from "../managers/portraitSelectorManager.js";
import { MODULE_ID } from "./constants.js";
import { checkDnDCss, setupGameSystemsSettingsHandler } from "../handlers/gameSystemsHandler.js";
import { checkFilePickerPlusCss, setupOtherModulesSettingsHandler } from "../handlers/otherModulesHandler.js";

let portraitSelectorInstance;

Hooks.once("ready", () => {
  setupSingletonInstances();
  setupModuleApi();
  checkAllCss();
});

Hooks.once("init", () => {
  setupModuleSettings();
  setupGameSystemsSettingsHandler();
  setupOtherModulesSettingsHandler();
});

function setupModuleApi() {
  game.modules.get(MODULE_ID).api = {
    openPortraitSelector: () => {
      if (!game.user.isGM) {
        ui.notifications.warn("Only GM can open the Portrait Manager Selector.");
        return;
      }
      
      portraitSelectorInstance.open();
    }
  }
}

function setupSingletonInstances() {
  portraitSelectorInstance = new PortraitSelector();
}

function setupModuleSettings() {
  game.settings.registerMenu(MODULE_ID, "portraitSelectorEditor", {
    name: "Portrait Selector Editor",
    label: "Open Portrait Selector Editor",
    hint: "Edit portrait selector data",
    type: PortraitSelectorManager,
    restricted: true
  });

  game.settings.register(MODULE_ID, "portraitSelectorData", {
    name: "Portrait Selector Data",
    scope: "world",
    config: false,
    type: Object,
    default: portraitSelectorExampleStructure
  });
}

function checkAllCss() {
  checkDnDCss();
  checkFilePickerPlusCss();
}