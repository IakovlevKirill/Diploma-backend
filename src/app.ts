import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger';
import testRouter from './routes/test.routes';

const app: Application = express();

//  middleware
app.use(cors());
app.use(express.json());

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Тестовый роут
app.use('/api', testRouter); // Все пути будут начинаться с /api

export default app;