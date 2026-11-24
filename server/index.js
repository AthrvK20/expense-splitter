import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors);
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

await mongoose.connect(process.env.MONGODB_URI);
console.log('MongoDB Connected')

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
