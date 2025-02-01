import { Item } from "../models/item";

export * as JsonService from "./jsonServer.service";

/**
 * Uses the Fetch API to get records from a specified URL.
 * @returns A Promise that resolves to a string representing the retrieved data.
 */
export async function getAllItems(): Promise<Item[]> {
  const hostname = process.env.HOSTNAME;
  const jsonPort: number = parseInt(process.env.JSON_PORT as string);
  const url: string = `http://${hostname}:${jsonPort}/items`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch items: ${response.statusText}`);
  }

  const items: Item[] = await response.json();
  return items;
}

/**
 * Uses the Fetch API to post a record to a specified URL.
 * @param jsonPayload - The JSON payload to be sent.
 * @returns A Promise that resolves to a string representing the response content.
 */
export async function createItem(jsonPayload: string): Promise<string> {
  const hostname = process.env.HOSTNAME;
  const jsonPort: number = parseInt(process.env.JSON_PORT as string);
  const url = `http://${hostname}:${jsonPort}/items`;

  /* ToDo */
  return "";
}

export async function patchItem(itemPayload: Item): Promise<string> {
  const hostname = process.env.HOSTNAME;
  const jsonPort: number = parseInt(process.env.JSON_PORT as string);
  const url = `http://${hostname}:${jsonPort}/items/${itemPayload.id}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemPayload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create item: ${response.statusText}`);
  }

  return await response.text();
}
