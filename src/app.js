import express, {urlencoded} from 'express';
import cors from 'cors';
import routes from './route/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: false}));

app.use(routes);

export default app;
