import express, {urlencoded} from 'express';
import cors from 'cors';
import routes from './route/index.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: false}));

app.use(routes);

export default app;
