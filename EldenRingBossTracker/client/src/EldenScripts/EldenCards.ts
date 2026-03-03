import { Item } from "./EldenItem";

// Definition des Typs für die Filter-Funktion
type filterFn = (inputArray: Item[], categoryArray: string[]) => Item[];

// Implementierung der Funktion
const filterByCategory: filterFn = (inputArray, categoryArray) => {
  if (categoryArray.length === 0) return inputArray; // Keine Filterkategorie, alle Items anzeigen

  return inputArray.filter(
    (item) =>
      Array.isArray(item.categories) &&
      item.categories.some((category: string) =>
        categoryArray.includes(category)
      )
  );
};
// Asynchrone Funktion fetchGet
export async function fetchGet(): Promise<Item[]> {
  const baseUrl = "http://127.0.0.1:3001/api/items?"; // Dein API-Endpunkt
  const searchParams = new URLSearchParams();
  console.log(selectedCategories);
  // Wenn Kategorien ausgewählt sind, werden diese als URL-Parameter hinzugefügt
  if (selectedCategories.length > 0) {
    selectedCategories.forEach((category) =>
      searchParams.append("search", category)
    );
  }

  const url = `${baseUrl}?${searchParams.toString()}`;

  try {
    // Mit der Fetch-API einen GET-Request an den Server senden
    const response = await fetch(url, {
      method: "GET", // HTTP-Methode GET
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data: Item[] = await response.json();

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("JSON-Syntaxfehler:", error.message);
      alert("Fehlerhafte Antwort vom Server. JSON-Format ungültig.");
    } else {
      console.error("Fehler beim Abrufen der Daten:", error);
      alert("Fehler beim Abrufen der Daten vom Server.");
    }
    throw error;
  }
}

export async function fetchPost(newItem: Item): Promise<void> {
  const baseUrl = "http://127.0.0.1:3001/api/items"; // Dein API-Endpunkt
  const url = `${baseUrl}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem), // Das neue Item wird als JSON gesendet
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Neues Item erfolgreich hinzugefügt:", data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("JSON-Syntaxfehler:", error.message);
      alert(
        "Das JSON-Format ist fehlerhaft. Bitte überprüfen Sie Ihre Eingaben."
      );
    } else {
      console.error("Fehler beim Senden der Daten:", error);
      alert("Es ist ein Fehler beim Senden der Daten aufgetreten.");
    }
  }
}

// Funktion zum Updaten des Boss-Status mit PATCH
async function updateBossStatus(
  bossId: string,
  categories: string[]
): Promise<void> {
  const baseUrl = `http://127.0.0.1:3001/api/items`;

  try {
    const response = await fetch(baseUrl, {
      method: "PATCH", // PATCH
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: bossId,
        categories,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    // console.log(
    //   `Boss ${bossId} wurde ${isChecked ? "getötet" : "wiederbelebt"}.`
    // );
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Boss-Status:", error);
  }
}

// Initialisierung der ausgewählten Kategorien
let selectedCategories: string[] = [];

// Funktion zum Erstellen der Karten
function createCards(items: Item[]): void {
  const container = document.querySelector("#cards-container");

  if (!container) {
    console.error("Container nicht gefunden!");
    return;
  }

  // Container leeren
  container.innerHTML = "";

  const isHighContrast = window.matchMedia("(prefers-contrast: more)").matches;

  // Neue Karten erstellen
  items.forEach((item) => {
    const card = document.createElement("div");
    card.setAttribute("data-boss-id", item.id);

    const isKilled = item.categories.includes("Killed");

    // Überprüfen, ob 'remembrance' in den Drops des Bosses vorhanden ist, um den goldenen Rand zu setzen
    const isRemembranceBoss = item.drops.some((drop) =>
      drop.toLowerCase().includes("remembrance")
    );

    card.classList.add(
      "card",
      "rounded-md",
      "p-4",
      "mb-4",
      "shadow-lg",
      "bg-black", // Hintergrund schwarz
      "bg-opacity-50", // Leicht transparent
      "relative" // Relativer Positionierungskontext für die Checkbox
    );

    // High Contrast Mode: Weißer Rand für alle Karten im High Contrast Mode
    if (isHighContrast) {
      card.classList.add("border-4", "border-white"); // Weißer Rand im High Contrast Mode
    } else {
      card.classList.add(isRemembranceBoss ? "border-gold" : "border-cards");
    }

    if (!isKilled) {
      const title = document.createElement("h2");
      title.classList.add("text-2xl", "font-bold", "text-white"); // Weißer Text für den Titel
      title.textContent = item.name;
      card.appendChild(title);

      const img2 = document.createElement("img");
      img2.src = "../EldenPictures/line2.png";
      img2.alt = `Bild von einer Linie`;
      img2.classList.add("w-full", "object-cover", "rounded", "mb-2");
      card.appendChild(img2);

      const img = document.createElement("img");
      img.src = item.image || "https://via.placeholder.com/150";
      img.alt = `Bild von ${item.name}`;
      img.classList.add("w-full", "h-96", "object-cover", "rounded", "mb-4");
      card.appendChild(img);

      const description = document.createElement("p");
      description.classList.add("mb-2", "text-white"); // Weißer Text für die Beschreibung
      description.innerHTML = `<span class="font-bold">Description:</span> ${item.description}`;
      card.appendChild(description);

      const region = document.createElement("p");
      region.classList.add("mb-2", "text-white"); // Weißer Text für Region
      region.innerHTML = `<span class="font-bold">Region:</span> ${item.region}`;
      card.appendChild(region);

      const location = document.createElement("p");
      location.classList.add("mb-2", "text-white"); // Weißer Text für Location
      location.innerHTML = `<span class="font-bold">Location:</span> ${item.location}`;
      card.appendChild(location);

      const healthPoints = document.createElement("p");
      healthPoints.classList.add("mb-2", "text-white"); // Weißer Text für Health Points
      healthPoints.innerHTML = `<span class="font-bold">Health Points:</span> ${item.healthPoints} <img src="../EldenPictures/heart.webp" alt="Heart" class="inline-block ml-2 w-6 h-6">`;
      card.appendChild(healthPoints);

      const runes = document.createElement("p");
      runes.classList.add("mb-2", "text-white"); // Weißer Text für Health Points
      runes.innerHTML = `<span class="font-bold">Runes:</span> ${item.runes} <img src="../EldenPictures/runes.webp" alt="Heart" class="inline-block ml-2 w-6 h-6">`;
      card.appendChild(runes);

      const drops = document.createElement("p");
      drops.classList.add("mb-4", "text-white");
      drops.innerHTML = `<span class="font-bold">Drops:</span> ${item.drops.join(", ")}`;
      card.appendChild(drops);

      const button = document.createElement("a");
      button.classList.add(
        "bg-[#7c602a]",
        "text-white",
        "py-3",
        "px-3",
        "rounded",
        "hover:bg-red-700"
      );
      button.textContent = "Learn More";
      button.href = "../EldenSites/EldenWiki.html";
      card.appendChild(button);

      // Checkbox hinzufügen
      const checkboxWrapper = document.createElement("div");
      checkboxWrapper.classList.add(
        "absolute",
        "bottom-4",
        "right-4",
        "flex",
        "items-center"
      );

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add(
        "appearance-none",
        "w-8",
        "h-8",
        "border-2",
        "border-[#c8a55f]",
        "rounded-md",
        "bg-black",
        "cursor-pointer",
        "transition",
        "duration-300",
        "checked:bg-[#531717]",
        "checked:border-red-400",
        "shadow-md",
        "shadow-[#c8a55f]/20", // Weniger intensiver Schatten
        "hover:shadow-sm",
        "hover:shadow-[#c8a55f]/30", // Weniger stark beim Hover
        "checked:before:content-['❌']", // Weißer Haken beim Aktivieren
        "checked:before:text-gray-300", // Weißer Haken
        "checked:before:absolute",
        "checked:before:top-1/2",
        "checked:before:left-1/2",
        "checked:before:transform",
        "checked:before:translate-x-[-50%]",
        "checked:before:translate-y-[-50%]"
      );
      checkbox.setAttribute("data-boss-id", item.id);

      checkbox.checked = isKilled;
      item.categories[0] = isKilled ? "Killed" : "Alive";

      checkbox.addEventListener("change", async () => {
        // Update categories based on new checkbox state
        item.categories[0] = checkbox.checked ? "Killed" : "Alive";
        await updateBossStatus(item.id, item.categories);
        // Refresh the card display after updating boss status
        const updatedItems = await fetchGet();
        createCards(updatedItems);
      });

      checkboxWrapper.appendChild(checkbox);
      card.appendChild(checkboxWrapper);

      container.appendChild(card);
    } else {
      const title = document.createElement("h2");
      title.classList.add("text-2xl", "font-bold", "text-gray-700"); // Weißer Text für den Titel
      title.textContent = item.name;
      card.appendChild(title);

      const img2 = document.createElement("img");
      img2.src = "../EldenPictures/line2.png";
      img2.alt = `Bild von einer Linie`;
      img2.classList.add(
        "w-full",
        "object-cover",
        "rounded",
        "mb-2",
        "filter",
        "brightness-50"
      );
      card.appendChild(img2);

      const img = document.createElement("img");
      img.src = item.image || "https://via.placeholder.com/150";
      img.alt = `Bild von ${item.name}`;
      img.classList.add(
        "w-full",
        "h-96",
        "object-cover",
        "rounded",
        "mb-4",
        "filter",
        "brightness-50"
      );
      card.appendChild(img);

      const description = document.createElement("p");
      description.classList.add("mb-2", "text-gray-700"); // Weißer Text für die Beschreibung
      description.innerHTML = `<span class="font-bold">Description:</span> ${item.description}`;
      card.appendChild(description);

      const region = document.createElement("p");
      region.classList.add("mb-2", "text-gray-700"); // Weißer Text für Region
      region.innerHTML = `<span class="font-bold">Region:</span> ${item.region}`;
      card.appendChild(region);

      const location = document.createElement("p");
      location.classList.add("mb-2", "text-gray-700"); // Weißer Text für Location
      location.innerHTML = `<span class="font-bold">Location:</span> ${item.location}`;
      card.appendChild(location);

      const healthPoints = document.createElement("p");
      healthPoints.classList.add("mb-2", "text-gray-700"); // Weißer Text für Health Points
      healthPoints.innerHTML = `<span class="font-bold">Health Points:</span> ${item.healthPoints} <img src="../EldenPictures/heart.webp" alt="Heart" class="inline-block ml-2 w-6 h-6 filter brightness-50">`;
      card.appendChild(healthPoints);

      const runes = document.createElement("p");
      runes.classList.add("mb-2", "text-gray-700"); // Weißer Text für Health Points
      runes.innerHTML = `<span class="font-bold">Runes:</span> ${item.runes} <img src="../EldenPictures/runes.webp" alt="Heart" class="inline-block ml-2 w-6 h-6 filter brightness-50">`;
      card.appendChild(runes);

      const drops = document.createElement("p");
      drops.classList.add("mb-4", "text-gray-700"); // Weißer Text für Drops
      drops.innerHTML = `<span class="font-bold">Drops:</span> ${item.drops.join(", ")}`;
      card.appendChild(drops);

      const button = document.createElement("a");
      button.classList.add(
        "bg-[#4a3a197b]",
        "text-gray-600",
        "py-3",
        "px-3",
        "rounded",
        "hover:bg-red-900",
        "hover:text-gray-400"
      );
      button.textContent = "Learn More";
      button.href = "../EldenSites/EldenWiki.html";
      card.appendChild(button);

      // Checkbox hinzufügen
      const checkboxWrapper = document.createElement("div");
      checkboxWrapper.classList.add(
        "absolute",
        "bottom-4",
        "right-4",
        "flex",
        "items-center"
      );

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add(
        "appearance-none",
        "w-8",
        "h-8",
        "border-2",
        "border-[#c8a55f]",
        "rounded-md",
        "bg-black",
        "cursor-pointer",
        "transition",
        "duration-300",
        "checked:bg-[#531717]",
        "checked:border-red-400",
        "shadow-md",
        "shadow-[#c8a55f]/20", // Weniger intensiver Schatten
        "hover:shadow-sm",
        "hover:shadow-[#c8a55f]/30", // Weniger stark beim Hover
        "checked:before:content-['❌']", // Weißer Haken beim Aktivieren
        "checked:before:text-gray-300", // Weißer Haken
        "checked:before:absolute",
        "checked:before:top-1/2",
        "checked:before:left-1/2",
        "checked:before:transform",
        "checked:before:translate-x-[-50%]",
        "checked:before:translate-y-[-50%]"
      );
      checkbox.setAttribute("data-boss-id", item.id);

      checkbox.checked = isKilled;
      item.categories[0] = isKilled ? "Killed" : "Alive";

      checkbox.addEventListener("change", async () => {
        // Update categories based on new checkbox state
        item.categories[0] = checkbox.checked ? "Killed" : "Alive";
        await updateBossStatus(item.id, item.categories);
        // Refresh the card display after updating boss status
        const updatedItems = await fetchGet();
        createCards(updatedItems);
      });

      checkboxWrapper.appendChild(checkbox);
      card.appendChild(checkboxWrapper);

      container.appendChild(card);
    }
  });
}

// Event-Listener nach DOM-Laden hinzufügen
document.addEventListener("DOMContentLoaded", async () => {
  const items = await fetchGet(); // Alle Items laden
  const categoryCheckboxes = document.querySelectorAll<HTMLInputElement>(
    'input[class^="filterBox"]'
  );

  createCards(items); // Initiale Kartenanzeige
  console.log("Items: ", items);

  // Event-Listener für Checkboxen
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      // Kategorien aktualisieren
      selectedCategories = Array.from(categoryCheckboxes)
        .filter((cb) => cb.checked) // Nur angekreuzte Checkboxen
        .map((cb) => cb.value); // Werte der Checkboxen sammeln

      console.log("Aktive Filterkategorien:", selectedCategories); // Debugging

      const filteredItems = filterByCategory(items, selectedCategories);
      console.log("Gefilterte Items:", filteredItems); // Debugging

      createCards(filteredItems); // Karten neu rendern
      console.log("filteredItems: ", filteredItems);
    });
  });
});
