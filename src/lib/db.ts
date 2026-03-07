import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDB() {
    if (mongoose.connection.readyState >= 1) return;

    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined in environment variables.');
        // Throwing error to catch it in API routes
        throw new Error('Database connection configuration missing.');
    }

    try {
        return await mongoose.connect(MONGODB_URI);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}
