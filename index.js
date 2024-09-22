import express, {urlencoded} from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({msg: 'hello word'})
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})

