// Required modules
import express from 'express';
import jsonServer from 'json-server';
import path from 'path';
import dotenv from 'dotenv';
// Own modules
import { itemRouter } from './routers/items.router';

// Create hostname and ports
dotenv.config({ path: path.join(__dirname, '../.env') });
const hostname = process.env.HOSTNAME as string;
const jsonPort = parseInt(process.env.JSON_PORT as string);
const expressPort = parseInt(process.env.EXPRESS_PORT as string);

// Create express webserver
const httpServer = express();

// Create json server with middleware
const server = jsonServer.create();
const router = jsonServer.router(
  path.join(__dirname, '../public/data/', 'db.json'),
);
const middlewares = jsonServer.defaults();

// Middleware to parse json in responses
// Set HTTP-SizeLimit to 2mb
httpServer.use(express.json({ limit: '2mb' }));
httpServer.use(function (_req, res, next) {
  // Allow all to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allow client vite server over localhost to http:post 'Content-Type': 'application/json' to express server
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  next();
});

// Use items router
httpServer.use('/api/items', itemRouter);

/**
 * Start json server listening
 */
server.use(middlewares);
server.use(router);
server.listen(jsonPort, hostname, () => {
  console.log(`JSON server is listening on http://${hostname}:${jsonPort}/`);
});

/**
 * Start express server listening
 */
httpServer.listen(expressPort, hostname, () => {
  console.log(
    `Express server is listening on http://${hostname}:${expressPort}/`,
  );
  console.log(`End server with ^C (CTRL + C)`);
});
