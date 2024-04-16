import mongoose from 'mongoose';

const connectToDatabase = async () => {
    const dbUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/'; // 替换为你的MongoDB URI
    try {
        await mongoose.connect(dbUri);
        console.log('Connected to database');
    } catch (error) {
        console.error('Could not connect to database:', error);
        process.exit(1);
    }
};

export default connectToDatabase;
