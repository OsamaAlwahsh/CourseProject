const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 

// Swagger documentation packages - ADD THESE AT THE TOP WITH OTHER IMPORTS
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Route imports
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const enrollmentRoutes = require('./routes/enrollments');
const quizRoutes = require('./routes/quizzes');
const submissionRoutes = require('./routes/submissions');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ====================== SWAGGER SETUP ======================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Course API',
      version: '1.0.0',
      description: 'Comprehensive API for online course management system',
      contact: {
        name: 'API Support',
        email: 'support@onlinecourse.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Development server'
      },
      {
        url: 'https://api.onlinecourse.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['student', 'instructor'],
              example: 'student'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'] // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
// ====================== END SWAGGER SETUP ======================

// Middleware
app.use(express.json());

// API Documentation Route - ADD THIS BEFORE YOUR OTHER ROUTES
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Application Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/submissions', submissionRoutes);

// Database connection and server start
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
      console.log(`API base URL: http://localhost:${PORT}/api`);
    });
  })
  .catch(error => {
    console.error('Database connection failed', error);
    process.exit(1);
  });