import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connectDB.js';
import groupsRoute from './routes/groupsRoute.js';
import handleError from './middlewares/handleError.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

await connectDB(process.env.MONGODB_URI);

app.use('/api/groups', groupsRoute);

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

app.get('/api/ping', (req, res) => {
    console.log('Someone Pinged');
});

app.get('/', (req, res) => {
    res.send('<h1>This is Home Page</h1>');
});

app.use(handleError);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
