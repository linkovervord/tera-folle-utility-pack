import {
  getPortraitSelectorData,
  savePortraitSelectorData,
} from "../scripts/dataStore.js";
import { PortraitSelectorCharacterEditor } from "./portraitSelectorCharacterEditor.js";

export class PortraitSelectorGroupEditor extends FormApplication {
  constructor(groupIndex, options = {}) {
    super(options);
    this.groupIndex = groupIndex;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "portrait-selector-group-editor-tfup-pts",
      title: "Portrait Selector Group Editor",
      template:
        "modules/tera-folle-utility-pack/templates/portraitSelectorGroupEditor.hbs",
      width: 700,
      height: "auto",
    });
  }

  getData() {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    return {
      group: groups[this.groupIndex],
      index: this.groupIndex,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".add-character-tfup-pts").click(() => { this._addCharacter() });

    html.find(".delete-character-tfup-pts").click((ev) => {
      const index = Number(ev.currentTarget.dataset.index);
      this._deleteCharacter(index);
    });

    html.find(".edit-character-tfup-pts").click((ev) => {
      const index = Number(ev.currentTarget.dataset.index);
      this._editCharacter(index);
    });

    html.find(".modify-character-name-tfup-pts").change(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      const value = ev.currentTarget.value;

      this._editCharacterName(index, value);
    })
  }

  async _addCharacter() {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups[this.groupIndex].characters.push({
      id: randomID(),
      name: "New Character",
      variants: [],
      companions: [],
    });

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _deleteCharacter(index) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups[this.groupIndex].characters.splice(index, 1);

    await savePortraitSelectorData(groups);

    this.render();
  }

  _editCharacter(index) {
    new PortraitSelectorCharacterEditor(this.groupIndex, index).render(true);
  }

  async _editCharacterName(index, value) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups[this.groupIndex].characters[index].name = value;

    await savePortraitSelectorData(groups);

    this.render();
  }
}
