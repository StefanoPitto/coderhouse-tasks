import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-COMMERCE',
      version: '1.0.0',
      description: 'API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:8080/api', // Update the URL to match your server configuration
      },
    ],
  },
  apis: [
    'src/routes/cartsRoute.js',
    'src/routes/productsRoute.js',
    'src/routes/sessionRoute.js',
    'src/routes/usersRoute.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
