import { Request, Response } from "express";
import { Item } from "../models/item";
import filterByCategory from "../services/item.service";
import { JsonService } from "../services/jsonServer.service";

/**
 * Controller class for handling item-related requests
 */
export class ItemController {
  /**
   * Retrieves items based on the search query parameter
   * @param request - The request object.
   * @param response - The response object.
   */
  public async getItem(request: Request, response: Response): Promise<void> {
    try {
      // Extrahiere die Suchparameter (z. B. Kategorien)
      const searchParams = request.query.search as string | undefined;
      const categoryArray = searchParams ? searchParams.split(",") : [];
      console.log("Cat; ", categoryArray);

      // Hole alle Items
      const allItems: Item[] = await JsonService.getAllItems();

      // Filtere Items basierend auf Kategorien
      const filteredItems: Item[] =
        categoryArray.length > 0
          ? filterByCategory(allItems, categoryArray)
          : allItems;

      console.log("Filter", filteredItems.length);
      // Antwort senden
      response.status(200).json(filteredItems);
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: "Internal server error" });
    }
  }

  /**
   * Creates a new item and sends the response.
   * @param request - The request object.
   * @param response - The response object.
   */
  public async createItem(request: Request, response: Response) {
    try {
      // Get the request body data
      const requestData = request.body;

      /* ToDo */
      const jsonServerResponse = "";

      // Assign the status to the response
      response.status(201);
      // Send the response
      response.send(jsonServerResponse);
    } catch (error) {
      console.error(error);
      response.status(500);
    }
  }

  public async patchItem(request: Request, response: Response): Promise<void> {
    try {
      // Hole die Request-Daten und validiere sie
      const requestData: Item = request.body;

      // Konvertiere das Item in einen JSON-String und sende es an den JSON-Server
      const jsonServerResponse = await JsonService.patchItem(requestData);

      // Erfolgsantwort senden
      response.status(201).send(jsonServerResponse);
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: "Internal server error" });
    }
  }
}
