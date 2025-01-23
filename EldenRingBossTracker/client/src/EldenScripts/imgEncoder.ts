export function encodeImageFileAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create new fileReader
    const reader = new FileReader();
    // Add onload event
    reader.onloadend = () => {
      // Resolve with base64 encoded result
      resolve(reader.result as string);
    };
    // Add onerror event
    reader.onerror = () => {
      // Reject with error
      reject(reader.error);
    };
    // Pass file to fileReader
    reader.readAsDataURL(blob);
  });
}
