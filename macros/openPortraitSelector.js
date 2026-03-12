const groups = [
  {
    "groupName": "Intrighi e Vampiri",
    "characters": [
      {
        "id": "ameno",
        "name": "Ameno",
        "variants": [
          { "name": "Ameno Base", "path": "Aatma/PERSONAGGI/Ameno.png" },
          { "name": "Ameno Maggiordomo", "path": "Aatma/PERSONAGGI/ameno_maggiordomo.png" },
          { "name": "Ameno Nanda", "path": "Aatma/PERSONAGGI/Ameno_Nanda.png" }
        ]
      },
      {
        "id": "phi",
        "name": "Phi",
        "variants": [
          { "name": "Phi Base", "path": "Aatma/PERSONAGGI/Companions/Phi_Umanoide.jpg" },
          { "name": "Phi Yukata", "path": "Aatma/PERSONAGGI/Companions/Phi_Umanoide_Yukata.jpg" }
        ]
      },
      {
        "id": "sern",
        "name": "Sern",
        "variants": [
          { "name": "Sern Base", "path": "Aatma/ISOLE/GUADALIS/VILLAGGI/VALIA/NPC/cittadini/Sern.png"}
        ],
        "companions": [
          {
            "id": "ameno",
            "name": "Ameno",
            "variants": [
              { "name": "Ameno Base", "path": "assets/srd5e/img/TheGiddyLimit/homebrew/master/_img/JennysHomebrewStuff/SCoC/0076.webp"}
            ]
          },
          {
            "id": "libro-volante",
            "name": "Libro Volante",
            "variants": [
              { "name": "Libro Volante Base", "path": "assets/srd5e/img/TheGiddyLimit/homebrew-img/refs/heads/main/img/ValdaWitch/Creatures/flying-book.webp"}
            ]
          }
        ]
      },
      {
        "id": "amy",
        "name": "Amy",
        "variants": [
          { "name": "Amy Base", "path": "Aatma/ISOLE/GUADALIS/CITTA%27/Lacht%C3%A0ra/QUARTIERI%20MALFAMATI/NPC/Amy_Sorella_Mismaia.jpg"}
        ]
      },
      {
        "id": "wertek",
        "name": "Wertek",
        "variants": [
          { "name": "Wertek Base", "path": "Aatma/PERSONAGGI/Companions/Costrutto_di_Ameno_Wertek.jpg"}
        ]
      }
    ]
  },
  {
    "groupName": "Lo Spettacolo Eterno",
    "characters": [
      {
        "id": "derrick",
        "name": "Derrick",
        "variants": [
          { "name": "Derrick Base", "path": "Aatma/PERSONAGGI/Derrick_Sniffington.jpg" },
          { "name": "Derrick Cavaliere", "path": "Aatma/PERSONAGGI/Derrick_Sniffington_MIthral.png" }
        ]
      },
      {
        "id": "gen",
        "name": "Gen",
        "variants": [
          { "name": "Gen Base", "path": "Aatma/PERSONAGGI/Gen.jpg"}
        ]
      },
      {
        "id": "light",
        "name": "Light",
        "variants": [
          { "name": "Light Base", "path": "Aatma/PERSONAGGI/Light.png"},
          { "name": "Light Obscure", "path": "Aatma/PERSONAGGI/Light%20Obscure.png"}
        ],
        "companions": [
          {
            "id": "kori",
            "name": "Kori",
            "variants": [
              { "name": "Kori Base", "path": "Aatma/PERSONAGGI/Companions/Gufo%20di%20Light.png"}
            ]
          }
        ]
      },
      {
        "id": "kael",
        "name": "Kael",
        "variants": [
          { "name": "Kael Base", "path": "Aatma/PERSONAGGI/Kael_Aeltherian.png"}
        ]
      },
      {
        "id": "sanguinius",
        "name": "Sanguinius",
        "variants": [
          { "name": "Sanguinius Base", "path": "Aatma/PERSONAGGI/Eldar_Blackraven.jpg"}
        ]
      }
    ]
  },
  {
    "groupName": "Rune e Rivelazioni",
    "characters": [
        {
        "id": "ragnar",
        "name": "Ragnar",
        "variants": [
          { "name": "Ragnar Base", "path": "Aatma/PERSONAGGI/Ragnar.png"}
        ],
        "companions": [
          {
            "id": "njord",
            "name": "Njord",
            "variants": [
              { "name": "Njord Base", "path": "Aatma/PERSONAGGI/Companions/Njord.png"}
            ]
          }
        ]
      }
    ]
  },
  {
    "groupName": "Il Cuore Avvelenato di Pròodos",
    "characters": [
      {
        "id": "pascal",
        "name": "Pascal",
        "variants": [
          { "name": "Pascal Base", "path": "Aatma/PERSONAGGI/Pascal.jpg"}
        ]
      },
      {
        "id": "grezza",
        "name": "Grezza",
        "variants": [
          { "name": "Grezza Base", "path": "Aatma/PERSONAGGI/Grezza.webp"}
        ]
      },
      {
        "id": "kevin",
        "name": "Kevin",
        "variants": [
          { "name": "Kevin Base", "path": "Aatma/PERSONAGGI/Kevin%20%E2%80%9CM07H3R5H1P%E2%80%9D%20Mitnick.jpeg"}
        ],
        "companions": [
          {
            "id": "alfred",
            "name": "Alfred",
            "variants": [
              { "name": "Alfred Base", "path": "Aatma/PERSONAGGI/Companions/Kevin_Steel_Defender.jpg"}
            ]
          }
        ]
      }
    ]
  }
];

export async function openPortraitSelector() {
  dialog.render(true);
}

const entityMap = new Map();

function registerEntities(char) {
  const ids = [];
  function walk(entity) {
    const id = crypto.randomUUID();
    entityMap.set(id, entity);
    ids.push(id);
    if (entity.companions) {
      for (const c of entity.companions) {
        walk(c);
      }
    }
  }
  walk(char);
  return ids;
}

let currentGroupIndex = 0;

/* ----------------------------- */
/* RENDER GRUPPO */
/* ----------------------------- */

function renderGroup(index) {
  const group = groups[index];
  let content = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <button id="prev-group" style="width: 32px; height: 32px; display: flex; justify-content: center; align-items:center;"><i class="fas fa-chevron-left"></i></button>
      <h2 style="margin:0;">${group.groupName}</h2>
      <button id="next-group" style="width: 32px; height: 32px; display: flex; justify-content: center; align-items:center;"><i class="fas fa-chevron-right"></i></button>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">`;

  for (const char of group.characters) {
    const ids = registerEntities(char);
    const entity = entityMap.get(ids[0]);
    const firstVariant = entity.variants[0];

    const hasVariants = entity.variants.length > 1;
    const hasCompanions = ids.length > 1;

    content += `
      <div class="char-card"
           data-ids='${ids.join(",")}'
           data-current="0"
           style="width:120px;text-align:center;display:flex;flex-direction:column;align-items:center;position:relative;">

        ${
          hasVariants
            ? `<i class="fas fa-star variant-star" style="position:absolute;top:4px;right:12px;color:#DBB300;font-size:12px;pointer-events:none;
        display:${entity.variants.length > 1 ? "block" : "none"};"></i>`
            : ""
        }

        <img
          class="char-img"
          src="${firstVariant.path}"
          data-entity-id="${ids[0]}"
          style="width:100px;height:150px;object-fit:cover;border:1px solid #000;border-radius:5px;cursor:pointer;">

        <div style="display: flex; align-items:center; justify-content:center">
          <p class="char-name" style="margin:5px 0;font-weight:bold;">${entity.name}</p>
          ${hasCompanions ? `<i class="fas fa-chevron-down companion-toggle" style="cursor:pointer;font-size:12px;margin-top:2px;margin-left:4px;"></i>` : ""}
        </div>
      </div>`;
  }

  content += `</div><p style="text-align:center;margin-top:10px;">Premi la rotellina del mouse per cambiare le immagini</p>`;

  return content;
}

function updateStar(card, entity) {
  const star = card.querySelector(".variant-star");
  if (!star) return;
  if (entity.variants.length > 1) {
    star.style.display = "block";
  } else {
    star.style.display = "none";
  }
}

document.addEventListener("mousedown", (e) => {
  if (e.button !== 1) return;

  const img = e.target.closest(".char-img");
  if (!img) return;

  const entity = entityMap.get(img.dataset.entityId);

  if (!entity || entity.variants.length <= 1) return;

  e.preventDefault();

  openVariantMenuWithPreview(e.pageX, e.pageY, img, entity.variants);
});

function openVariantMenuWithPreview(x, y, img, variants) {
  const oldMenu = document.getElementById("variant-menu");
  if (oldMenu) oldMenu.remove();

  const menu = document.createElement("div");
  menu.id = "variant-menu";
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
      img.src = v.path; // cambia immagine principale
      menu.remove();
    };

    option.onmouseenter = () => {
      option.style.background = "#444";
      preview.src = v.path; // aggiorna preview
    };
    option.onmouseleave = () => (option.style.background = "transparent");

    list.appendChild(option);
  });

  menu.appendChild(list);
  menu.appendChild(preview);
  document.body.appendChild(menu);

  document.addEventListener("click", () => menu.remove(), { once: true });
}

function openCompanionSelector(icon) {
  const card = icon.closest(".char-card");
  const ids = card.dataset.ids.split(",");

  const old = document.getElementById("companion-selector");
  if (old) old.remove();

  const menu = document.createElement("div");
  menu.id = "companion-selector";
  menu.style.position = "absolute";
  menu.style.background = "#222";
  menu.style.border = "1px solid #555";
  menu.style.padding = "5px";
  menu.style.borderRadius = "5px";
  menu.style.zIndex = 10000;

  ids.forEach((id, i) => {
    const entity = entityMap.get(id);
    const option = document.createElement("div");
    option.textContent = entity.name;
    option.style.cursor = "pointer";
    option.style.padding = "3px 6px";
    option.style.color = "#fff";

    option.onclick = () => {
      const card = icon.closest(".char-card");
      card.dataset.current = i;
      const img = card.querySelector(".char-img");
      const name = card.querySelector(".char-name");
      img.src = entity.variants[0].path;
      img.dataset.entityId = id;
      name.textContent = entity.name;

      updateStar(card, entity);
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

function attachListeners(html) {
  // Companion toggle
  html.find(".companion-toggle").click((ev) => {
    ev.stopPropagation();
    openCompanionSelector(ev.currentTarget);
  });

  // Middle click varianti
  html.find(".char-img").mousedown((ev) => {
    if (ev.button === 1) {
      // middle click
      const img = ev.currentTarget;
      const entity = entityMap.get(img.dataset.entityId);
      if (entity.variants.length > 1) {
        ev.preventDefault();
        openVariantMenuWithPreview(ev.pageX, ev.pageY, img, entity.variants);
      }
    }
  });

  // Click normale immagine
  html.find(".char-img").click((ev) => {
    const img = ev.currentTarget;
    const entity = entityMap.get(img.dataset.entityId);
    const path = img.src;
    const texture = new ImagePopout(path, {
      title: "Immagine di " + entity.name + " | Mostrata da " + game.user.name,
    });
    texture.render(true);
    texture.shareImage();
  });

  // Frecce gruppi
  html.find("#prev-group").click(() => {
    currentGroupIndex = (currentGroupIndex - 1 + groups.length) % groups.length;
    html.find("#group-container").html(renderGroup(currentGroupIndex));
    attachListeners(html); // riattacco listener
  });
  html.find("#next-group").click(() => {
    currentGroupIndex = (currentGroupIndex + 1) % groups.length;
    html.find("#group-container").html(renderGroup(currentGroupIndex));
    dialog.position.height = null; // resetta l'altezza
    dialog.setPosition({
      width: dialog.position.width,
      height: "auto",
    });
    attachListeners(html); // riattacco listener
  });
}

let dialog = new Dialog(
  {
    title: "Scegli immagine",
    content: `<div id="group-container" style="max-height:60vh; overflow-y:auto;">${renderGroup(currentGroupIndex)}</div>`,
    buttons: {
      close: { icon: '<i class="fas fa-times"></i>', label: "Chiudi" },
    },
    render: (html) => {
      attachListeners(html);
    },
  },
  { width: 700 },
);
