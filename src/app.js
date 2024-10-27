import express, {urlencoded} from 'express';
import cors from 'cors';
import routes from './route/index.js';
import dotenv from 'dotenv';
import upload from './config/multer.config.js';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: false}));
app.use(upload.any());

app.use(routes);

export default app;
