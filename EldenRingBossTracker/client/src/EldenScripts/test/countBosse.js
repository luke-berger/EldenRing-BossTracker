import * as fs from "fs"; // fs-Modul zum Arbeiten mit Dateien

// Funktion, um die Anzahl der einzigartigen Locations zu zählen
export function countLocations() {
  try {
    // JSON-Datei lesen
    const data = fs.readFileSync("eldenring_bosses.json", "utf-8");
    const bosses = JSON.parse(data); // JSON in ein JavaScript-Objekt umwandeln

    // Set zur Speicherung der einzigartigen Locations
    const uniqueLocations = new Set();

    // Für jeden Boss die Locations überprüfen
    bosses.forEach((boss) => {
      // Überprüfen, ob der Boss Locations hat
      if (boss.location) {
        // Falls es mehrere Locations gibt (als String mit Kommas getrennt), trennen wir sie
        const locations = boss.location
          .split(",")
          .map((location) => location.trim());
        locations.forEach((location) => {
          uniqueLocations.add(location); // Füge jede Location zum Set hinzu
        });
      }
    });

    // Ausgabe der Anzahl der einzigartigen Locations
    console.log(`Es gibt ${uniqueLocations.size} einzigartige Locations.`);
  } catch (error) {
    console.error("Fehler beim Lesen der Datei:", error);
  }
}

// Aufruf der Funktion
countLocations();
