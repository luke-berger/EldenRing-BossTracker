import fs from "fs";

// Funktion zum Extrahieren von Runen und Modifizieren der Daten
const extractRunes = () => {
  // Lese die bestehende db.json-Datei
  fs.readFile("db.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Fehler beim Lesen der Datei:", err);
      return;
    }

    // Parste die JSON-Daten
    const jsonData = JSON.parse(data);
    let items = jsonData.items;

    // Durchlaufe jedes Item und extrahiere die Runen
    items = items.map((item) => {
      // Filtere alle Drops, die "Runes" enthalten, heraus
      const runes = item.drops.filter((drop) =>
        drop.toLowerCase().includes("runes")
      );

      // Entferne die Runen aus der Drops-Liste
      item.drops = item.drops.filter(
        (drop) => !drop.toLowerCase().includes("runes")
      );

      // Füge die Runen als separate Kategorie hinzu
      item.runes = runes;

      return item;
    });

    // Speichere die bearbeiteten Daten zurück in die db.json
    fs.writeFile("db.json", JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Fehler beim Schreiben der Datei:", err);
      } else {
        console.log("Daten erfolgreich aktualisiert.");
      }
    });
  });
};

// Aufruf der Funktion
extractRunes();
