import fetch from "node-fetch"; // Falls du node-fetch verwendest
import * as fs from "fs"; // Das fs-Modul aus Node.js

// API-URL
const apiUrl = "https://eldenring.fanapis.com/api/bosses";

// Daten abrufen und in Datei speichern
export async function saveBossData() {
  try {
    // Seite 1 abrufen
    let currentPage = 0;
    let allBosses = [];

    while (true) {
      console.log(`Seite ${currentPage + 1} abgerufen`);

      const response = await fetch(`${apiUrl}?limit=20&page=${currentPage}`);
      const data = await response.json();

      // Alle Bosse sammeln
      allBosses = allBosses.concat(data.data);

      // Wenn weniger als 20 Bosse zurückgegeben werden, sind wir am Ende
      if (data.data.length < 20) {
        break;
      }

      // Nächste Seite anfordern
      currentPage++;
    }

    // Daten in JSON-Datei speichern
    fs.writeFileSync(
      "eldenring_bosses.json",
      JSON.stringify(allBosses, null, 2),
      "utf-8"
    );
    console.log(
      `Es wurden ${allBosses.length} Bosse erfolgreich in 'eldenring_bosses.json' gespeichert!`
    );
  } catch (error) {
    console.error("Fehler beim Abrufen oder Speichern der Daten:", error);
  }
}

// Die Funktion wird exportiert, damit sie verwendet werden kann
saveBossData();
