import { Item } from "./item";

// Definition des Typs für die Filter-Funktion
type filterFn = (inputArray: Item[], categoryArray: string[]) => Item[];

// Implementierung der Funktion
const filterByCategory: filterFn = (inputArray, categoryArray) => {
  // Rückgabe der Items, deren Kategorien mindestens eine Übereinstimmung haben
  if (categoryArray.length === 0) return inputArray; // Keine Filterkategorie, alle Items anzeigen

  return inputArray.filter((item) =>
    item.categories.some((category) => categoryArray.includes(category))
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
    card.classList.add("card", "rounded-md", "p-4", "mb-4", "shadow-lg"); // Grundklassen

    const title = document.createElement("h2");
    title.classList.add("text-2xl", "font-bold", "mb-2");
    title.textContent = item.name;
    card.appendChild(title);

    const img = document.createElement("img");
    img.src = item.image || "https://via.placeholder.com/150";
    img.alt = `Bild von ${item.name}`;
    img.classList.add("w-full", "h-40", "object-cover", "rounded", "mb-4");
    card.appendChild(img);

    const description = document.createElement("p");
    description.classList.add("mb-2");
    description.innerHTML = `<span class="font-bold">Beschreibung:</span> ${item.description}`;
    card.appendChild(description);

    const date = document.createElement("p");
    date.classList.add("mb-2");
    date.innerHTML = `<span class="font-bold">Kaufdatum:</span> ${item.date}`;
    card.appendChild(date);

    const price = document.createElement("p");
    price.classList.add("mb-2");
    price.innerHTML = `<span class="font-bold">Preis:</span> ${item.price} €`;
    card.appendChild(price);

    const categories = document.createElement("p");
    categories.classList.add("mb-4");
    categories.innerHTML = `<span class="font-bold">Kategorien:</span> ${item.categories.join(", ")}`;
    card.appendChild(categories);

    const button = document.createElement("button");
    button.classList.add(
      "bg-red-500",
      "text-white",
      "py-2",
      "px-4",
      "rounded",
      "hover:bg-red-700"
    );
    button.textContent = "Mehr erfahren";
    card.appendChild(button);

    container.appendChild(card);
  });
}

// Event-Listener nach DOM-Laden hinzufügen
document.addEventListener("DOMContentLoaded", async () => {
  const items = await fetchGet();
  const categoryCheckboxes = document.querySelectorAll('input[name^="input"]');

  createCards(items);

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;

      if (target.checked) {
        if (!selectedCategories.includes(target.value)) {
          selectedCategories.push(target.value);
        }
      } else {
        selectedCategories = selectedCategories.filter(
          (category) => category !== target.value
        );
      }

      const filteredItems = filterByCategory(items, selectedCategories);
      createCards(filteredItems);
    });
  });
});
