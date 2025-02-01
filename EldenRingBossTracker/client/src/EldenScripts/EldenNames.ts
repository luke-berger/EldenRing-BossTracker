import { fetchGet } from "./EldenCards";
import { Item } from "./EldenItem";

function createWikiList(items: Item[]): void {
  const sideBar = document.getElementById("sideBar");

  if (!sideBar) {
    console.error("SideBar nicht gefunden!");
    return;
  }

  // Sidebar leeren
  sideBar.innerHTML = "";

  // Namen hinzufügen
  items.forEach((item) => {
    const nameLink = document.createElement("a");
    if (
      item.name === "Maliketh, The Black Blade" ||
      item.name === "Malenia, Blade Of Miquella" ||
      item.name === "Astel, Stars Of Darkness"
    ) {
      nameLink.href = `./${item.name}.html`;
    } else {
      nameLink.href = `./EldenWiki.html`;
    }
    nameLink.textContent = `⟢ ${item.name}`;

    sideBar.appendChild(nameLink);
  });
}

// Event-Listener nach DOM-Laden hinzufügen
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Daten abrufen
    const items = await fetchGet();

    // Liste im Wiki-Style erstellen
    createWikiList(items);
  } catch (error) {
    console.error("Fehler beim Laden der Items:", error);
  }
});
