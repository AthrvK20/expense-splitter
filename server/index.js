import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { connectDB } from './db/connectDB.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

app.get('/api/ping', (req, res) => {
    console.log('Someone Pinged');
});

app.get('/', (req, res) => {
    res.send('<h1>This is Home Page</h1>');
});

await connectDB(process.env.MONGODB_URI);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
