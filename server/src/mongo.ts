import mongoose from 'mongoose';

const setMongo = async (): Promise<any> => {
    const mongodbURI = process.env.MONGO_URI!;
    console.log(mongodbURI)
    await mongoose.connect(mongodbURI, {retryWrites: true});
};

export default setMongo;