// app.js
import express, {urlencoded} from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.json({msg: 'hello world'});
});

export default app;
