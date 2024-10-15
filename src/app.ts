import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import errorHandler from './app/middlewares/errorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import dotenv from 'dotenv';

dotenv.config();
const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      // process.env.CLIENT_URL as string,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);


app.use('/api', router);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to TecX app");
});

app.use(errorHandler);


app.use(notFound);

export default app;
