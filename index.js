const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Initialize express
const app = express();
app.use(express.json()); // For parsing JSON request bodies

// Sample in-memory data (to store the items)
let items = [
  { id: 1, name: 'Item 1'},
  { id: 2, name: 'Item 2'},
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the item
 *         name:
 *           type: string
 *           description: The name of the item
 *       example:
 *         id: 1
 *         name: Item 1
 */

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: API for managing items
 */

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Retrieves a list of items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get('/api/v1/items', (req, res) => {
  res.status(200).json(items);
});

/**
 * @swagger
 * /api/v1/items/{id}:
 *   get:
 *     summary: Get an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The item ID
 *     responses:
 *       200:
 *         description: The item description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
app.get('/api/v1/items/get', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id, 10));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.status(200).json(item);
});

/**
 * @swagger
 * /api/v1/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: The item was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Invalid input
 */
app.post('/api/v1/items', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const newItem = { id: items.length + 1, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

/**
 * @swagger
 * /api/v1/items/{id}:
 *   put:
 *     summary: Update an existing item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: The item was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       400:
 *         description: Invalid input
 */
app.put('/api/v1/items/put', (req, res) => {
  const { name } = req.body;
  const item = items.find(i => i.id === parseInt(req.params.id, 10));

  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (!name) return res.status(400).json({ message: 'Name is required' });

  item.name = name;
  res.status(200).json(item);
});

/**
 * @swagger
 * /api/v1/items/delete:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The item ID
 *     responses:
 *       200:
 *         description: The item was deleted
 *       404:
 *         description: Item not found
 */
app.delete('/api/v1/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id, 10));

  if (index === -1) return res.status(404).json({ message: 'Item not found' });

  items.splice(index, 1);
  res.status(200).json({ message: 'Item deleted' });
});

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js CRUD API with Swagger',
    version: '1.0.0',
    description: 'A simple CRUD API application made with Express and documented with Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

// Swagger options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./index.js'], // Files containing annotations for API documentation
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve swagger docs using swagger-ui-express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

//const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));