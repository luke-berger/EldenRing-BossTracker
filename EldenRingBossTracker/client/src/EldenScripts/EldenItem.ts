export type Item = {
  categories: string[];
  id?: string; // Optional, falls vorhanden
  name: string; // Name des Bosses
  description: string; // Beschreibung des Bosses
  image: string; // URL des Bildes des Bosses
  region: string; // Region, in der der Boss erscheint
  location: string; // Location des Bosses
  healthPoints: string; // Lebenspunkte des Bosses
  drops: string[]; // Liste der Drops des Bosses
};
