import { MODULE_ID } from "../scripts/constants.js";
import { getPortraitSelectorData } from "../scripts/dataStore.js";

export async function importPortraitManagerData(file) {
  const text = await file.text();
  const json = JSON.parse(text);

  if (json.module !== MODULE_ID && json.relation !== "portraitData") {
    ui.notifications.error("File non valido");
    return;
  }

  await game.settings.set(
    MODULE_ID,
    "portraitSelectorData",
    json.data
  );

  ui.notifications.info("Portrait data imported successfully!");
}

export async function exportPortraitManagerData() {
  const data = getPortraitSelectorData();

  const exportData = {
    module: MODULE_ID,
    version: game.modules.get(MODULE_ID).version,
    relation: "portraitData",
    data: foundry.utils.deepClone(data)
  };

  const json = JSON.stringify(exportData, null, 2);

  const blob = new Blob([json], {type: "application/json"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tfup-portrait-manager-data.json";
  a.click();

  URL.revokeObjectURL(url);
}