import mongoose from 'mongoose'
import { config } from './env.js'

export const connectDB = async ()=> {
  try{
    if (!config.mongoUri) {
      throw new Error('MONGO_CONNECTION_STRING is required');
    }

    await mongoose.connect(config.mongoUri);
    console.log("Database connected");
  }
  catch(error){
      console.log("Error connecting Database : ", error);
      throw error;
  }
}
