import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@wizarmarkcluster.da1si6x.mongodb.net/WizarMark_DB?retryWrites=true&w=majority&appName=WizarMarkCluster`
        );

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
        process.exit(1);
    }
}

export default connectDB;





