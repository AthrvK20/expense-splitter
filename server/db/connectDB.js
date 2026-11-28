import mongoose from 'mongoose';

export const connectDB = async (MONGODB_URI) => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database Connected');
    } catch (error) {
        console.error(error.name, error.message);
        process.exit(1);
    }
};
