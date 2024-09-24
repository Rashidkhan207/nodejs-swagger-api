const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Initialize express
const app = express();
app.use(express.json()); // For parsing JSON request bodies

// Sample in-memory user data (with one record)
let users = [
  {
    id: 10,
    username: 'theUser',
    firstName: 'John',
    lastName: 'James',
    email: 'john@email.com',
    password: '12345',
    phone: '12345',
    userStatus: 1,
  },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         username:
 *           type: string
 *           description: The user's username
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password
 *         phone:
 *           type: string
 *           description: The user's phone number
 *         userStatus:
 *           type: integer
 *           description: The user's status (1 for active, 0 for inactive)
 *       example:
 *         id: 10
 *         username: theUser
 *         firstName: John
 *         lastName: James
 *         email: john@email.com
 *         password: 12345
 *         phone: 12345
 *         userStatus: 1
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retrieves a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/v1/users', (req, res) => {
  res.status(200).json(users);
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user data by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
app.get('/api/v1/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id, 10));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
});

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 */
app.post('/api/v1/users', (req, res) => {
  const { username, firstName, lastName, email, password, phone, userStatus } = req.body;
  if (!username || !firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newUser = {
    id: users.length + 1, // Auto-generate ID based on the current length
    username,
    firstName,
    lastName,
    email,
    password,
    phone,
    userStatus: userStatus || 1, // Default to active if not provided
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid input
 */
app.put('/api/v1/users/:id', (req, res) => {
  const { username, firstName, lastName, email, password, phone, userStatus } = req.body;
  const user = users.find(u => u.id === parseInt(req.params.id, 10));

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!username || !firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  user.username = username;
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = password;
  user.phone = phone;
  user.userStatus = userStatus || 1;

  res.status(200).json(user);
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: User not found
 */
app.delete('/api/v1/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id, 10));

  if (index === -1) return res.status(404).json({ message: 'User not found' });

  users.splice(index, 1);
  res.status(200).json({ message: 'User deleted' });
});

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js CRUD API with Swagger',
    version: '1.0.0',
    description: 'A simple CRUD API for managing users made with Express and documented with Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
};

// Swagger options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./main.js'], // Files containing annotations for API documentation
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve swagger docs using swagger-ui-express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

const corsOptions ={
  origin:'http://localhost:3001', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));





let items = [
  { id: 1, name: 'Item 1', discription: 'product info',},
  { id: 2, name: 'Item 2', discription: 'product info',},
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - discription
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the item
 *         name:
 *           type: string
 *           description: The name of the item
 *         discription:
 *           type: string
 *           description: Product related info
 *       example:
 *         id: 1
 *         name: Item 1
 *         discription: Product related info
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
app.get('/api/v1/items/:id', (req, res) => {
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
  const { name,discription } = req.body;
  if (!name || !discription) return res.status(400).json({ message: 'All fields is required' });

  const newItem = { id: items.length + 1, name, discription };
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
app.put('/api/v1/items/:id', (req, res) => {
  const { name, discription } = req.body;
  const item = items.find(i => i.id === parseInt(req.params.id, 10));

  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (!name || !discription) return res.status(400).json({ message: 'All fields is required' });

  item.name = name;
  item.discription = discription;
  res.status(200).json(item);
});

/**
 * @swagger
 * /api/v1/items/{id}:
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
