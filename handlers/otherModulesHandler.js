import { MODULE_ID } from "../scripts/constants.js";

export function setupOtherModulesSettingsHandler() {
  setupSettingsFilePickerPlus();
}

export function checkFilePickerPlusCss() {
  if (game.modules.get("filepicker-plus")?.active) {
    const enabledCss = game.settings.get(
      MODULE_ID,
      "enableFilePickerPlusCssTweaks",
    );

    if (enabledCss) {
      enableFilePickerPlusCss();
    }
  }
}

function setupSettingsFilePickerPlus() {
  if (game.modules.get("filepicker-plus")?.active) {
    game.settings.register(MODULE_ID, "enableFilePickerPlusCssTweaks", {
      name: "Modifiche CSS FilePicker Plus",
      hint: "Attiva le modifiche estetiche del modulo a Tutti.",
      scope: "world",
      config: true,
      type: Boolean,
      default: false,

      onChange: (value) => {
        if (value) {
          enableFilePickerPlusCss();
        } else {
          disableFilePickerPlusCss();
        }
      },
    });
  }
}

function enableFilePickerPlusCss() {
  if (document.getElementById("tfup-filepicker-plus-css")) return;

  const link = document.createElement("link");

  link.id = "tfup-filepicker-plus-css";
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = foundry.utils.getRoute(`modules/${MODULE_ID}/styles/tera-folle-file-picker-plus-custom-changes.css`);

  document.head.appendChild(link);
}

function disableFilePickerPlusCss() {
  const css = document.getElementById("tfup-filepicker-plus-css");

  if (css) css.remove();
}
