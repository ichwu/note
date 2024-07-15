import mongoose from 'mongoose';

// 通过调用 toJSON 方法，在序列化文档为 JSON 时转换 _id 为 id
mongoose.set('toJSON', {
    transform: function (doc, ret) {
        // ret.id = ret._id; // 将 _id 赋值给 id
        delete ret._id; // 删除 _id 字段
    }
});

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
