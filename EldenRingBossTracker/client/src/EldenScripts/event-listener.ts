import { Item } from "./item";
import { encodeImageFileAsBase64 } from "./imgEncoder";
import { fetchPost } from "./EldenCards";

document.addEventListener("DOMContentLoaded", () => {
  // Button und Input-Elemente finden
  const button = document.getElementById("AddButton");
  const inpElem1 = document.getElementById("input1") as HTMLInputElement;
  const inpElem2 = document.getElementById("input2") as HTMLInputElement;
  const inpElem3 = document.getElementById("input3") as HTMLInputElement;
  const inpElem4 = document.getElementById("input4") as HTMLInputElement;
  const fileInput = document.getElementById("inputImg") as HTMLInputElement;
  const success = document.getElementById("success");
  const fail = document.getElementById("fail");

  // Überprüfen, ob der Button existiert
  if (!button) {
    console.error("Button nicht gefunden!");
    return;
  }

  // Click-EventListener hinzufügen
  button.addEventListener("click", async () => {
    // Werte der Eingabefelder trimmen und prüfen
    const iptValue1 = inpElem1.value.trim();
    const iptValue2 = inpElem2.value.trim();
    const iptValue3 = inpElem3.value.trim();
    const iptValue4 = inpElem4.value.trim();

    const name = inpElem1.value.trim();
    const description = inpElem2.value.trim();
    const price = parseFloat(iptValue3); // Preis als Zahl konvertieren
    const date = inpElem4.value.trim();

    // Kategorien: Alle angekreuzten Checkboxen in ein Array umwandeln
    const categoryCheckboxes = document.querySelectorAll(
      'input[name^="input5"]:checked'
    );
    const categories = Array.from(categoryCheckboxes).map(
      (checkbox) => (checkbox as HTMLInputElement).value
    );

    const files = fileInput.files;
    const file = files ? files[0] : null; // Wenn keine Datei ausgewählt wurde, wird null zugewiesen

    // Eingabeprüfungen für jedes Feld
    if (!iptValue1) {
      inpElem1.classList.add("border-4", "border-red-600");
      fail?.classList.remove("hidden");
    } else {
      inpElem1.classList.remove("border-4", "border-red-600");
    }

    if (!iptValue2) {
      inpElem2.classList.add("border-4", "border-red-600");
      fail?.classList.remove("hidden");
    } else {
      inpElem2.classList.remove("border-4", "border-red-600");
    }

    if (!iptValue3 || isNaN(price)) {
      inpElem3.classList.add("border-4", "border-red-600");
      fail?.classList.remove("hidden");
    } else {
      inpElem3.classList.remove("border-4", "border-red-600");
    }

    if (!iptValue4) {
      inpElem4.classList.add("border-4", "border-red-600");
      fail?.classList.remove("hidden");
    } else {
      inpElem4.classList.remove("border-4", "border-red-600");
    }

    if (!files || files.length === 0) {
      // Kein Datei-Upload
      fileInput.classList.add("border-4", "border-red-600");
      fail?.classList.remove("hidden");
    } else if (file && file.size > 2 * 1024 * 1024) {
      // Maximale Dateigröße überschritten
      console.error("Datei überschreitet die maximale Größe von 2 MB.");
      alert("Das Bild ist zu groß. Bitte laden Sie ein Bild unter 2 MB hoch.");
      fileInput.classList.add("border-4", "border-red-600");
      fail?.classList.remove("hidden");
      return;
    } else {
      // Datei-Upload vorhanden und Größe akzeptabel
      fileInput.classList.remove("border-4", "border-red-600");
    }

    // Wenn alle Eingaben korrekt sind
    if (
      iptValue1 &&
      iptValue2 &&
      iptValue3 &&
      iptValue4 &&
      !isNaN(price) &&
      (!files || files.length === 1)
    ) {
      success?.classList.remove("hidden");
      fail?.classList.add("hidden");

      let encodedImage = "";

      if (file) {
        try {
          encodedImage = await encodeImageFileAsBase64(file); // Base64-String für das Bild generieren
        } catch (error) {
          console.error("Fehler beim Kodieren des Bildes:", error);
          alert("Fehler beim Verarbeiten des Bildes.");
          fail?.classList.remove("hidden");
          return;
        }
      }

      const newItem: Item = {
        name,
        description,
        price,
        date,
        categories,
        image: encodedImage,
      };

      console.log("Erstelltes Item:", newItem);

      try {
        // Sende das neue Item an den Server
        await fetchPost(newItem);
      } catch (error) {
        console.error("Fehler beim Senden des Items:", error);
        alert(
          "Fehler beim Senden der Daten. Bitte versuchen Sie es später erneut."
        );
        fail?.classList.remove("hidden");
      }
    } else {
      success?.classList.add("hidden");
    }
  });
});
