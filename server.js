const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
// Initialize express
const app = express();
app.use(express.json()); // For parsing JSON request bodies

// Define basic routes for your API
app.get('/api/v1/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js API with Swagger',
    version: '1.0.0',
    description: 'A simple CRUD API application made with Express and documented with Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Development server',
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./server.js'], // Files containing annotations for API documentation
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve swagger docs using swagger-ui-express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});


/**
 * @swagger
 * /api/v1/hello:
 *   get:
 *     summary: Returns a greeting message
 *     description: A simple API that returns a "Hello World!" message.
 *     responses:
 *       200:
 *         description: A JSON object containing a message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World!
 */
app.get('/api/v1/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  
