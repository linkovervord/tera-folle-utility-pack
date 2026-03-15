import { MODULE_ID } from "../scripts/constants.js";

export function setupGameSystemsSettingsHandler() {
  setupSettingsDnD5e();
}

export function checkDnDCss() {
  if (game.system.id === "dnd5e") {
    const enabledCss = game.settings.get(MODULE_ID, "enableDnDCssTweaks");

    if (enabledCss) {
      enableDnDCss();
    }
  }
}

function setupSettingsDnD5e() {
  if (game.system.id === "dnd5e") {
    game.settings.register(MODULE_ID, "enableDnDCssTweaks", {
      name: "Modifiche CSS D&D",
      hint: "Attiva le modifiche estetiche del modulo a Tutti.",
      scope: "world",
      config: true,
      type: Boolean,
      default: false,

      onChange: (value) => {
        if (value) {
          enableDnDCss();
        } else {
          disableDnDCss();
        }
      },
    });
  }
}

function enableDnDCss() {
  if (document.getElementById("tfup-dnd-css")) return;

  const link = document.createElement("link");

  link.id = "tfup-dnd-css";
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = foundry.utils.getRoute(`modules/${MODULE_ID}/styles/tera-folle-dnd-custom-changes.css`);

  document.head.appendChild(link);
}

function disableDnDCss() {
  const css = document.getElementById("tfup-dnd-css");

  if (css) css.remove();
}
