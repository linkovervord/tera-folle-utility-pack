import { MODULE_ID } from "../scripts/constants.js";

export class PortraitSelector {

  constructor() {
    this.entityMap = new Map();
    this.currentGroupIndex = 0;
    this.groups = [];
    this.dialog = null;

    this._registerGlobalMiddleClick();
  }

  async open() {
    this.groups = await game.settings.get(
      MODULE_ID,
      "portraitSelectorData"
    ) ?? [];

    if (!this.groups.length) {
      ui.notifications.warn("Nessun gruppo di ritratti trovato. Assicurati di aver configurato i dati correttamente.");
      return;
    }

    this.entityMap = new Map();
    this.currentGroupIndex = 0;

    this.dialog = new Dialog(
      {
        title: "Scegli immagine",
        content: `<div id="group-container-tfup-pts" style="max-height:60vh; overflow-y:auto;">${this.renderGroup(this.currentGroupIndex)}</div>`,
        buttons: {
          close: { icon: '<i class="fas fa-times"></i>', label: "Chiudi" },
        },
        render: (html) => {
          this.attachListeners(html);
        },
      },
      { width: 700 }
    );

    this.dialog.render(true);
  }

  /* ----------------------------- */
  /* ENTITY REGISTRATION */
  /* ----------------------------- */

  registerEntities(char) {
    const ids = [];

    const walk = (entity) => {
      const id = crypto.randomUUID();
      this.entityMap.set(id, entity);
      ids.push(id);

      if (entity.companions) {
        for (const c of entity.companions) {
          walk(c);
        }
      }
    };

    walk(char);
    return ids;
  }

  /* ----------------------------- */
  /* RENDER GRUPPO */
  /* ----------------------------- */

  renderGroup(index) {
    if (this.groups && !this.groups.length) 
      return "<p style='text-align:center;'>Nessun gruppo disponibile</p>";

    const group = this.groups[index];
    const multipleGroups = this.groups.length > 1;

    let content = `
      <div style="display:flex;align-items:center;justify-content:${multipleGroups ? "space-between" : "center"};margin-bottom:10px;margin-top:4px;">

        ${multipleGroups ? `
        <button id="prev-group-tfup-pts" style="width:32px;height:32px;display:flex;justify-content:center;align-items:center;">
          <i class="fas fa-chevron-left"></i>
        </button>` : ""}

        <select 
          id="group-select-tfup-pts"
          style="
            margin:0;
            font-size:1.6em;
            font-weight:bold;
            border:none;
            border-bottom: 2px solid #914d00;
            background:transparent;
            text-align:center;
            appearance:none;
            cursor:pointer;
          "
        >
          ${this.groups.map((g, i) => `
            <option value="${i}" ${i === this.currentGroupIndex ? "selected" : ""}>
              ${g.groupName}
            </option>
          `).join("")}
        </select>

        ${multipleGroups ? `
        <button id="next-group-tfup-pts" style="width:32px;height:32px;display:flex;justify-content:center;align-items:center;">
          <i class="fas fa-chevron-right"></i>
        </button>` : ""}

      </div>

      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">`;

    if (!group.characters.length) {
      content += `<p style="text-align:center;width:100%;">Nessun personaggio presente in questo gruppo</p>`;
    }else {
      for (const char of group.characters) {
        const ids = this.registerEntities(char);
        const entity = this.entityMap.get(ids[0]);

        const firstVariant = entity.variants?.[0];
        const imgPath = firstVariant?.path ?? "icons/svg/mystery-man.svg";

        const hasVariants = entity.variants?.length > 1;
        const hasCompanions = ids.length > 1;

        content += `
        <div class="char-card-tfup-pts"
            data-ids='${ids.join(",")}'
            data-current="0"
            style="width:120px;text-align:center;display:flex;flex-direction:column;align-items:center;position:relative;">

          <i class="fas fa-star variant-star"
            style="
              position:absolute;
              top:4px;
              right:12px;
              color:#DBB300;
              font-size:12px;
              pointer-events:none;
              display:${hasVariants ? "block" : "none"};
            ">
          </i>

          <img
            class="char-img-tfup-pts"
            src="${imgPath}"
            data-entity-id="${ids[0]}"
            style="width:100px;height:150px;object-fit:cover;border:1px solid #000;border-radius:5px;cursor:pointer;">

          <div style="display:flex;align-items:center;justify-content:center">
            <p class="char-name-tfup-pts" style="margin:5px 0;font-weight:bold;">${entity.name}</p>

            ${hasCompanions ?
              `<i class="fas fa-chevron-down companion-toggle-tfup-pts"
                  style="cursor:pointer;font-size:12px;margin-top:2px;margin-left:4px;"></i>`
              : ""
            }
          </div>

        </div>`;
      }
    }

    content += `</div>
    <p style="text-align:center;margin-top:10px;">
      Premi la rotellina del mouse per cambiare le immagini
    </p>`;

    return content;
  }

  /* ----------------------------- */

  updateStar(card, entity) {
    const star = card.querySelector(".variant-star");
    if (!star) return;

    star.style.display = (entity.variants?.length ?? 0) > 1 ? "block" : "none";
  }

  /* ----------------------------- */
  /* VARIANT MENU */
  /* ----------------------------- */

  openVariantMenuWithPreview(x, y, img, variants) {
    const oldMenu = document.getElementById("variant-menu-tfup-pts");
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement("div");

    menu.id = "variant-menu-tfup-pts";
    menu.style.position = "absolute";
    menu.style.left = x + "px";
    menu.style.top = y + "px";
    menu.style.background = "#222";
    menu.style.border = "1px solid #555";
    menu.style.borderRadius = "5px";
    menu.style.padding = "5px";
    menu.style.zIndex = 10000;
    menu.style.minWidth = "150px";
    menu.style.display = "flex";
    menu.style.gap = "8px";

    const list = document.createElement("div");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "4px";

    const preview = document.createElement("img");
    preview.style.width = "120px";
    preview.style.height = "150px";
    preview.style.objectFit = "cover";
    preview.style.border = "1px solid #444";
    preview.style.borderRadius = "5px";

    preview.src = img.getAttribute("src");

    variants.forEach((v) => {
      const option = document.createElement("div");
      option.textContent = v.name;
      option.style.cursor = "pointer";
      option.style.padding = "3px 6px";
      option.style.color = "#fff";

      option.onclick = () => {
        img.src = v.path;
        menu.remove();
      };

      option.onmouseenter = () => {
        option.style.background = "#444";
        preview.src = v.path;
      };

      option.onmouseleave = () => option.style.background = "transparent";

      list.appendChild(option);
    });

    menu.appendChild(list);
    menu.appendChild(preview);

    document.body.appendChild(menu);

    document.addEventListener("click", () => menu.remove(), { once: true });
  }

  /* ----------------------------- */
  /* COMPANION MENU */
  /* ----------------------------- */

  openCompanionSelector(icon) {
    const card = icon.closest(".char-card-tfup-pts");
    const ids = card.dataset.ids.split(",");

    const old = document.getElementById("companion-selector-tfup-pts");
    if (old) old.remove();

    const menu = document.createElement("div");

    menu.id = "companion-selector-tfup-pts";
    menu.style.position = "absolute";
    menu.style.background = "#222";
    menu.style.border = "1px solid #555";
    menu.style.padding = "5px";
    menu.style.borderRadius = "5px";
    menu.style.zIndex = 10000;

    ids.forEach((id, i) => {
      const entity = this.entityMap.get(id);

      const option = document.createElement("div");

      option.textContent = entity.name;
      option.style.cursor = "pointer";
      option.style.padding = "3px 6px";
      option.style.color = "#fff";

      option.onclick = () => {
        card.dataset.current = i;

        const img = card.querySelector(".char-img-tfup-pts");
        const name = card.querySelector(".char-name-tfup-pts");

        img.src = entity.variants[0]?.path ?? "icons/svg/mystery-man.svg";
        img.dataset.entityId = id;

        name.textContent = entity.name;

        this.updateStar(card, entity);
        this._resetDialogHeight();

        menu.remove();
      };

      menu.appendChild(option);
    });

    const rect = icon.getBoundingClientRect();

    menu.style.left = rect.left + "px";
    menu.style.top = rect.bottom + "px";

    document.body.appendChild(menu);
    document.addEventListener("click", () => menu.remove(), { once: true });
  }

  /* ----------------------------- */
  /* LISTENERS */
  /* ----------------------------- */

  attachListeners(html) {
    html.find(".companion-toggle-tfup-pts").click((ev) => {
      ev.stopPropagation();
      this.openCompanionSelector(ev.currentTarget);
    });

    html.find(".char-img-tfup-pts").click((ev) => {
      const img = ev.currentTarget;
      const entity = this.entityMap.get(img.dataset.entityId);

      const texture = new ImagePopout(img.src.replace(/^http?:\/\/[^/]+/, ""), {
        title: "Immagine di " + entity.name + " | Mostrata da " + game.user.name
      });

      texture.render(true);
      texture.shareImage();
    });

    html.find("#prev-group-tfup-pts").click(() => {
      this.currentGroupIndex =
        (this.currentGroupIndex - 1 + this.groups.length) % this.groups.length;

      this.entityMap.clear();

      html.find("#group-container-tfup-pts").html(
        this.renderGroup(this.currentGroupIndex)
      );

      this._resetDialogHeight();
      this.attachListeners(html);
    });

    html.find("#next-group-tfup-pts").click(() => {
      this.currentGroupIndex =
        (this.currentGroupIndex + 1) % this.groups.length;

      this.entityMap.clear();

      html.find("#group-container-tfup-pts").html(
        this.renderGroup(this.currentGroupIndex)
      );

      this._resetDialogHeight();
      this.attachListeners(html);
    });

    html.find("#group-select-tfup-pts").change(ev => {
      const index = Number(ev.currentTarget.value);

      this.currentGroupIndex = index;

      this.entityMap.clear();

      html.find("#group-container-tfup-pts").html(
        this.renderGroup(this.currentGroupIndex)
      );

      this._resetDialogHeight();
      this.attachListeners(html);
    });
  }

  /* ----------------------------- */
  /* GLOBAL MIDDLE CLICK */
  /* ----------------------------- */

  _registerGlobalMiddleClick() {
    if (PortraitSelector._middleClickRegistered) return;
    PortraitSelector._middleClickRegistered = true;

    document.addEventListener("mousedown", (e) => {
      if (e.button !== 1) return;

      const img = e.target.closest(".char-img-tfup-pts");
      if (!img) return;

      const entity = this.entityMap.get(img.dataset.entityId);

      if (!entity || (entity.variants?.length ?? 0) <= 1) return;

      e.preventDefault();

      this.openVariantMenuWithPreview(
        e.pageX,
        e.pageY,
        img,
        entity.variants
      );
    });
  }

  /* ----------------------------- */
  /* DIALOG HEIGHT */
  /* ----------------------------- */

  _resetDialogHeight() {
    this.dialog.position.height = null;

    this.dialog.setPosition({
      width: this.dialog.position.width,
      height: "auto"
    });
  }
}