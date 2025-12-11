
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // console.log('MONGODB_URI:', process.env.MONGODB_URI);
        const MONGODB_URI = process.env.MONGODB_URI ;
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

export default connectDB;
