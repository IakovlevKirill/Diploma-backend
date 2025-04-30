import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger';
import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';

const app: Application = express();

//  middleware
app.use(cors());
app.use(express.json());

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Роуты

app.use(authRouter);
app.use(projectRouter);

export default app;