import { Request, Response } from 'express';
import { Item } from '../models/item';
import filterByCategory from '../services/item.service';
import { JsonService } from '../services/jsonServer.service';

/**
 * Controller class for handling item-related requests
 */
export class ItemController {
  /**
   * Retrieves items based on the search query parameter
   * @param request - The request object.
   * @param response - The response object.
   */
  public async getItem(request: Request, response: Response) {
    try {
      // GET request param called search
      const param: string[] = request?.query?.search as string[];

      /* ToDo */
      const responseData = new Array<Item>();

      // Create response
      response
        // Assign the status to the response
        .status(200)
        // Assign the response body
        .json(responseData);
    } catch (error) {
      // Write logs to console and set response status to 500 for internal error
      console.error(error);
      response.status(500);
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
      const jsonServerResponse = '';

      // Assign the status to the response
      response.status(201);
      // Send the response
      response.send(jsonServerResponse);
    } catch (error) {
      console.error(error);
      response.status(500);
    }
  }
}
