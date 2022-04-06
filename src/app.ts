import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import routes from "./routes";
dotenv.config();
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(urlencoded({ extended: false }));
app.use(json());

routes(app);

export default app;
