import { Item } from "./EldenItem";
import { encodeImageFileAsBase64 } from "./test/imgEncoder";
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
    // Kategorien: Alle angekreuzten Checkboxen in ein Array umwandeln
    const categoryCheckboxes = document.querySelectorAll(
      'input[class^="filterBox"]:checked'
    );
    const categories = Array.from(categoryCheckboxes).map(
      (checkbox) => (checkbox as HTMLInputElement).value
    );
  });
});
