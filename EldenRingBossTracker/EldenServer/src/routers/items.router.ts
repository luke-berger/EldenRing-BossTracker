import { Router } from 'express';
import { ItemController } from '../controller/item.controller';

/**
 * Router for handling item-related requests
 */
export const itemRouter = Router();

/**
 * Controller handling item-related requests
 */
export const itemController = new ItemController();

// Create GET route for retrieving items based on the search query parameter
itemRouter.get('/', itemController.getItem);

// Create POST route to create a new item
itemRouter.post('/', itemController.createItem);
