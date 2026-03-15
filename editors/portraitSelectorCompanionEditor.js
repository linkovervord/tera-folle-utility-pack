import { getPortraitSelectorData, savePortraitSelectorData } from "../scripts/dataStore.js";

export class PortraitSelectorCompanionEditor extends FormApplication {

  constructor(groupIndex, charIndex, companionIndex, options = {}) {
    super(options);

    this.groupIndex = groupIndex;
    this.charIndex = charIndex;
    this.companionIndex = companionIndex;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "portrait-selector-companion-editor-tfup-pts",
      title: "Portrait Selector Companion Variants",
      template: "modules/tera-folle-utility-pack/templates/portraitSelectorCompanionEditor.hbs",
      width: 700,
      height: "auto"
    });
  }

  getData() {
    const groups = foundry.utils.deepClone(
      getPortraitSelectorData()
    );

    const companion =
      groups[this.groupIndex]
      .characters[this.charIndex]
      .companions[this.companionIndex];

    return { companion };
  }

  activateListeners(html) {
    html.find(".add-variant-tfup-pts").click(() => this._addVariant());

    html.find(".delete-variant-tfup-pts").click(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      this._deleteVariant(index);
    });

    html.find(".file-picker-tfup-pts").click(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      this._openFilePicker(index);
    });

    html.find(".companion-image-preview-tfup-pts").click((ev) => {
      const path = ev.currentTarget.src;
      new ImagePopout(path).render(true);
    });

    html.find(".modify-companion-variant-name-tfup-pts").change(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      const value = ev.currentTarget.value;
      this._editCompanionVariantName(index, value);
    })

    html.find(".modify-companion-variant-image-path-tfup-pts").change(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      const value = ev.currentTarget.value;
      this._editCompanionVariantImagePath(value, index);
    })
  }

  _openFilePicker(index) {
    const fp = new FilePicker({
      type: "image",
      callback: (path) => {
        this._editCompanionVariantImagePath(path, index);
      },
    });

    fp.render(true);
  }

  async _addVariant() {
    const groups = foundry.utils.deepClone(
      getPortraitSelectorData()
    );

    const variants =
      groups[this.groupIndex]
      .characters[this.charIndex]
      .companions[this.companionIndex]
      .variants;

    variants.push({
      name: "New Variant",
      path: ""
    });

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _deleteVariant(index) {
    const groups = foundry.utils.deepClone(
      getPortraitSelectorData()
    );

    const variants =
      groups[this.groupIndex]
      .characters[this.charIndex]
      .companions[this.companionIndex]
      .variants;

    variants.splice(index, 1);

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _editCompanionVariantName(index, value) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups[this.groupIndex].characters[this.charIndex].companions[this.companionIndex].variants[index].name = value;

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _editCompanionVariantImagePath(path, index) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups[this.groupIndex].characters[this.charIndex].companions[this.companionIndex].variants[index].path = path;

    await savePortraitSelectorData(groups);

    this.render();
  }

}