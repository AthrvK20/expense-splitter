import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connectDB.js';
import groupsRoute from './routes/groupsRoute.js';
import handleError from './middlewares/handleError.js';
import handleUnknownRoutes from './middlewares/handleUnknownRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.CLIENT_URL) {
    console.error('CLIENT_URL is not set. Aborting');
    process.exit(1);
}

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

await connectDB(process.env.MONGODB_URI);

app.use('/api/groups', groupsRoute);

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

app.use(handleUnknownRoutes);

app.use(handleError);

app.listen(PORT || 3000, () => {
    console.log(`Server running on port ${PORT}`);
});
