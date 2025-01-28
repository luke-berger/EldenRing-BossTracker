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
  const baseUrl = "http://127.0.0.1:3002/items?"; // Dein API-Endpunkt
  const searchParams = new URLSearchParams();

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

  // Neue Karten erstellen
  items.forEach((item) => {
    const card = document.createElement("div");

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
      "relative", // Relativer Positionierungskontext für die Checkbox
      isRemembranceBoss ? "border-gold" : "border-white" // Goldener Rand für Remembrance Bosse, sonst weiß
    );

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
    img.classList.add("w-full", "h-80", "object-cover", "rounded", "mb-4");
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

    // Runen suchen und darstellen
    const runeDrop = item.drops.find((drop) =>
      drop.toLowerCase().includes("runes")
    );
    const runes = document.createElement("p");
    runes.classList.add("mb-4", "text-white"); // Weißer Text für Runen
    if (runeDrop) {
      runes.innerHTML = `<span class="font-bold">Runes:</span> ${runeDrop} <img src="../EldenPictures/runes.webp" alt="Rune" class="inline-block ml-2 w-4 h-4">`;
      // Entfernen der Runen aus den Drops
      item.drops = item.drops.filter(
        (drop) => !drop.toLowerCase().includes("runes")
      );
    } else {
      runes.innerHTML = `<span class="font-bold">Runes:</span> Keine Runen-Drops`;
    }
    card.appendChild(runes);

    const drops = document.createElement("p");
    drops.classList.add("mb-4", "text-white"); // Weißer Text für Drops
    drops.innerHTML = `<span class="font-bold">Drops:</span> ${item.drops.join(", ")}`;
    card.appendChild(drops);

    const button = document.createElement("button");
    button.classList.add(
      "bg-[#7c602a]",
      "text-gray-100",
      "py-2",
      "px-4",
      "rounded",
      "hover:bg-red-700"
    );
    button.textContent = "Learn More";
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
      "w-5",
      "h-5",
      "border-2",
      "border-white",
      "rounded-md",
      "focus:ring-2",
      "focus:ring-white"
    );

    checkboxWrapper.appendChild(checkbox);
    card.appendChild(checkboxWrapper);

    container.appendChild(card);
  });
}

// Event-Listener nach DOM-Laden hinzufügen
document.addEventListener("DOMContentLoaded", async () => {
  const items = await fetchGet(); // Alle Items laden
  console.log("Items geladen:", items); // Debugging

  const categoryCheckboxes = document.querySelectorAll<HTMLInputElement>(
    'input[class^="filterBox"]'
  );

  createCards(items); // Initiale Kartenanzeige

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
    });
  });
});
