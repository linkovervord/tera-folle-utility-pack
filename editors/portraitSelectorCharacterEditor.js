import {
  getPortraitSelectorData,
  savePortraitSelectorData,
} from "../scripts/dataStore.js";
import { PortraitSelectorCompanionEditor } from "./portraitSelectorCompanionEditor.js";

export class PortraitSelectorCharacterEditor extends FormApplication {
  constructor(groupIndex, characterIndex, options = {}) {
    super(options);
    this.groupIndex = groupIndex;
    this.characterIndex = characterIndex;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "portrait-selector-character-editor-tfup-pts",
      title: "Portrait Selector Character Editor",
      template:
        "modules/tera-folle-utility-pack/templates/portraitSelectorCharacterEditor.hbs",
      width: 700,
      height: "auto",
    });
  }

  getData() {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    const character = groups[this.groupIndex].characters[this.characterIndex];

    return {
      character,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".add-variant-tfup-pts").click(() => this._addVariant());

    html.find(".delete-variant-tfup-pts").click((ev) => {
      const index = Number(ev.currentTarget.dataset.index);
      this._deleteVariant(index);
    });

    html.find(".add-companion-tfup-pts").click(() => this._addCompanion());

    html.find(".delete-companion-tfup-pts").click((ev) => {
      const index = Number(ev.currentTarget.dataset.index);
      this._deleteCompanion(index);
    });

    html.find(".file-picker-tfup-pts").click((ev) => {
      const index = Number(ev.currentTarget.dataset.index);  
      this._openFilePicker(index);
    });

    html.find(".character-image-preview-tfup-pts").click((ev) => {
      const path = ev.currentTarget.src;
      new ImagePopout(path).render(true);
    });

    html.find(".modify-character-variant-name-tfup-pts").change(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      const value = ev.currentTarget.value;
      this._editCharacterVariantName(index, value);
    })

    html.find(".modify-character-variant-image-path-tfup-pts").change(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      const value = ev.currentTarget.value;
      this._editCharacterVariantImagePath(index, value);
    })

    html.find(".modify-companion-name-tfup-pts").change(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      const value = ev.currentTarget.value;
      this._editCompanionName(index, value);
    })

    html.find(".edit-companion-tfup-pts").click((ev) => {
      const index = Number(ev.currentTarget.dataset.index);

      new PortraitSelectorCompanionEditor(this.groupIndex, this.characterIndex, index).render(
        true,
      );
    });
  }

  async _addVariant() {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    const char = groups[this.groupIndex].characters[this.characterIndex];

    char.variants.push({
      name: "New Variant",
      path: "",
    });

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _deleteVariant(index) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    const char = groups[this.groupIndex].characters[this.characterIndex];

    char.variants.splice(index, 1);

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _addCompanion() {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    const char = groups[this.groupIndex].characters[this.characterIndex];

    char.companions.push({
      id: randomID(),
      name: "New Companion",
      variants: [],
    });

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _deleteCompanion(index) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    const char = groups[this.groupIndex].characters[this.characterIndex];

    char.companions.splice(index, 1);

    await savePortraitSelectorData(groups);

    this.render();
  }

  _openFilePicker(index) {
    const fp = new FilePicker({
      type: "image",
      callback: (path) => {
        this._editCharacterVariantImagePath(index, path);
      },
    });

    fp.render(true);
  }

  async _editCharacterVariantName(index, value) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups[this.groupIndex].characters[this.characterIndex].variants[index].name = value;

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _editCompanionName(index, value) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups[this.groupIndex].characters[this.characterIndex].companions[index].name = value;

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _editCharacterVariantImagePath(index, value) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups[this.groupIndex].characters[this.characterIndex].variants[index].path = value;

    await savePortraitSelectorData(groups);

    this.render();
  }
}
