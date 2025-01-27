// Funktion zum Codieren von Bilddateien als Base64
export function encodeImageFileAsBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(blob);
  });
}

// Funktion, um alle Bilder in der JSON zu ersetzen
export async function updateBossImages(bossesJson) {
  for (const boss of bossesJson) {
    if (boss.image) {
      try {
        // Bild von der URL abrufen
        const response = await fetch(boss.image);
        if (response.ok) {
          const imageBlob = await response.blob();

          // Bild als Base64 codieren
          const base64Image = await encodeImageFileAsBase64(imageBlob);

          // Bild in der Boss-Datenstruktur ersetzen
          boss.image = base64Image;
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

// Funktion zum Laden der JSON aus der Datei
export async function loadBossesJson(dbFilePath) {
  const fs = await import("fs");
  const data = await fs.promises.readFile(dbFilePath, "utf-8");
  return JSON.parse(data);
}

// Funktion zum Speichern der aktualisierten JSON in der Datei
export async function saveUpdatedBossesJson(updatedBossesJson, dbFilePath) {
  const fs = await import("fs");
  await fs.promises.writeFile(
    dbFilePath,
    JSON.stringify(updatedBossesJson, null, 2),
    "utf-8"
  );
}
