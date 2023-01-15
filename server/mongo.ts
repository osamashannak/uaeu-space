import mongoose from 'mongoose';

const setMongo = async (): Promise<any> => {
    let mongodbURI: string;
    mongodbURI = process.env.DB as string;
    await mongoose.connect(mongodbURI);
    console.log('Connected to MongoDB');
};

export default setMongo;