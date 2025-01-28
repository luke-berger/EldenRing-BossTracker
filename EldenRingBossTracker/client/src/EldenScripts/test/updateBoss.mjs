import fs from "fs";

const filePath = "./db.json";

try {
  // 1. Datei einlesen
  const rawData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(rawData);

  // 2. Neue Bosslisten
  const majorBosses = [
    "Radagon of the Golden Order",
    "Elden Beast",
    "Malenia, Blade of Miquella",
    "Godrick the Grafted",
    "Rennala, Queen of the Full Moon",
    "Starscourge Radahn",
    "Rykard, Lord of Blasphemy",
    "Mohg, Lord of Blood",
    "Morgott, the Omen King",
    "Fire Giant",
    "Lichdragon Fortissax",
    "Regal Ancestor Spirit",
    "Astel, Naturalborn of the Void",
    "Dragonlord Placidusax",
    "Mohg, the Omen",
    "Maliketh, the Black Blade",
  ];

  const progressionBosses = [
    "Godrick the Grafted",
    "Red Wolf of Radagon",
    "Rennala, Queen of the Full Moon",
    "Starscourge Radahn",
    "Draconic Tree Sentinel",
    "Morgott, the Omen King",
    "Fire Giant",
    "Godskin Duo",
    "Godfrey, First Elden Lord (golden Shade)",
    "Godfrey, First Elden Lord (hoarah Loux)",
    "Maliketh, the Black Blade",
    "Sir Gideon Ofnir, the All-Knowing",
    "Radagon of the Golden Order",
    "Elden Beast",
  ];

  // 3. Kategorien hinzufügen
  data.items = data.items.map((boss) => {
    const categories = ["Alive"]; // Standardkategorie

    // Debugging: Namen anzeigen
    console.log(`Verarbeite Boss: ${boss.name}`);

    // Progression hinzufügen
    if (progressionBosses.includes(boss.name)) {
      categories.push("Progression");
      console.log(`  -> Progression hinzugefügt für: ${boss.name}`);
    }

    // Major hinzufügen
    if (majorBosses.includes(boss.name)) {
      categories.push("Major");
      console.log(`  -> Major hinzugefügt für: ${boss.name}`);
    }

    return {
      ...boss,
      categories, // Kategorien aktualisieren
    };
  });

  // 4. Datei zurückschreiben
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log("✅ Kategorien erfolgreich aktualisiert!");
} catch (error) {
  console.error("❌ Fehler beim Aktualisieren von db.json:", error);
}
