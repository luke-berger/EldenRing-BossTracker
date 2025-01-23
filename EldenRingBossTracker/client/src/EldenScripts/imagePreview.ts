const listener = (event: Event) => {
  // Get the list of selected files by change-event parameter called event
  const selectedInput: HTMLInputElement = event.target as HTMLInputElement;
  const selectedFiles: FileList | null = selectedInput.files;
  // Check if there is any selected file
  if (!selectedFiles || selectedFiles.length === 0) return;
  // Check if there is only one selected file
  if (selectedFiles.length === 1) {
    // Get a url to the selected file
    const localUrl = URL.createObjectURL(selectedFiles[0]);
    // Get img-element using DOM-API
    // Nutzen Sie die DOM-API, um auf das img-Element zurückzugreifen
    const imageHTMLElement: HTMLElement | null = document.getElementById('imgElem');
    // Cast to HTMLImageElement
    const imageElement: HTMLImageElement = imageHTMLElement as HTMLImageElement;
    // Check if imageElement is null
    if (!imageElement) return;
    // Show the selected image
    if(imageElement) {
    //Setzen Sie die src-Property des img-Elements auf die Variable `localUrl`
    imageElement.src = localUrl;
    // Zeigen Sie das img-Element an bspw. über das Entfernen der Tailwind-Klasse `hidden`
    imageElement.classList.remove('hidden');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const inputHTMLElement: HTMLElement | null = document.getElementById('inputImg');
  const inputElement: HTMLInputElement = inputHTMLElement as HTMLInputElement;

  if (!inputElement) return;

  // Registriere den `change`-EventListener
  inputElement.addEventListener('change', listener);
});