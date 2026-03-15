import { PortraitSelectorGroupEditor } from "../editors/portraitSelectorGroupEditor.js";
import { getPortraitSelectorData, savePortraitSelectorData } from "../scripts/dataStore.js";

export class PortraitSelectorManager extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "portrait-selector-manager-tfup-pts",
      title: "Portrait Selector Manager",
      template: "modules/tera-folle-utility-pack/templates/portraitSelectorManager.hbs",
      width: 700,
      height: "auto"
    });
  }

  getData() {
    return {
      groups: foundry.utils.deepClone(getPortraitSelectorData())
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".add-group-tfup-pts").click(() => this._createGroup());

    html.find(".edit-group-tfup-pts").click(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      this._editGroup(index);
    });

    html.find(".delete-group-tfup-pts").click(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      this._deleteGroup(index);
    });
    
    html.find(".modify-group-name-tfup-pts").change(ev => {
      const index = Number(ev.currentTarget.dataset.index);
      const value = ev.currentTarget.value;

      this._editGroupName(index, value);
    })
  }

  async _createGroup() {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups.push({
      groupName: "New Group",
      characters: []
    });

    await savePortraitSelectorData(groups);

    this.render();
  }

  _editGroup(index) {
    new PortraitSelectorGroupEditor(index).render(true);
  }

  async _deleteGroup(index) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups.splice(index, 1);

    await savePortraitSelectorData(groups);

    this.render();
  }

  async _editGroupName(index, value) {
    const groups = foundry.utils.deepClone(getPortraitSelectorData());

    groups[index].groupName = value;

    await savePortraitSelectorData(groups);

    this.render();
  }

}