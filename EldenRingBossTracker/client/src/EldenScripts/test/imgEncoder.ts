import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// Funktion zum Codieren von Bilddateien als Base64 in Node.js
export function encodeImageFileAsBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}

// Funktion, um alle Bilder in der JSON zu ersetzen
async function updateBossImages(bossesJson: any[]) {
  for (const boss of bossesJson) {
    if (boss.image) {
      try {
        // Bild von der URL abrufen
        const response = await fetch(boss.image);
        if (response.ok) {
          const imageBuffer = await response.buffer(); // Bild als Buffer holen

          // Bild als Base64 codieren
          const base64Image = encodeImageFileAsBase64(imageBuffer);

          // Bild in der Boss-Datenstruktur ersetzen
          boss.image = `data:image/png;base64,${base64Image}`; // Falls es ein PNG ist
        } else {
          console.error(
            `Fehler beim Laden des Bildes für ${boss.name}: ${response.status}`
          );
        }
      } catch (error) {
        console.error(
          `Fehler beim Verarbeiten des Bildes für ${boss.name}:`,
          error
        );
      }
    }
  }

  // JSON nach Bildersetzung zurückgeben
  return bossesJson;
}

// Pfad zur db.json-Datei
const dbFilePath = path.join(__dirname, "db.json");

// Funktion zum Laden der JSON aus der Datei
async function loadBossesJson() {
  return new Promise<any[]>((resolve, reject) => {
    fs.readFile(dbFilePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// Funktion zum Speichern der aktualisierten JSON in der Datei
async function saveUpdatedBossesJson(updatedBossesJson: any[]) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(
      dbFilePath,
      JSON.stringify(updatedBossesJson, null, 2),
      "utf-8",
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

// Hauptfunktion, die die gesamte Logik ausführt
async function main() {
  try {
    // Schritt 1: Boss-Daten aus der db.json laden
    const bossesJson = await loadBossesJson();

    // Schritt 2: Alle Bilder in der JSON ersetzen
    const updatedBossesJson = await updateBossImages(bossesJson);

    // Schritt 3: Die aktualisierte JSON in der db.json speichern
    await saveUpdatedBossesJson(updatedBossesJson);

    console.log("Bilder erfolgreich aktualisiert!");
  } catch (error) {
    console.error("Fehler:", error);
  }
}

// Hauptfunktion ausführen
main();
