/**
 * Represents a pile-of-shame item
 *
 * @typedef {Object} Item
 * @property {string} id - The unique identifier of the item.
 * @property {string} name - The name of the item.
 * @property {string} description - The description of the item.
 * @property {number} price - The price of the item.
 * @property {string[]} categories - The categories that the item belongs to.
 * @property {string} date - The date when the item was created.
 * @property {string} image - The URL of the item's image.
 */
export type Item = {
  categories: string[];
  id: string; // Optional, falls vorhanden
  name: string; // Name des Bosses
  description: string; // Beschreibung des Bosses
  image: string; // URL des Bildes des Bosses
  region: string; // Region, in der der Boss erscheint
  location: string; // Location des Bosses
  healthPoints: string; // Lebenspunkte des Bosses
  drops: string[]; // Liste der Drops des Bosses
  runes: string[];
};
