import mongoose from "mongoose";

const connectDB = async (mongoUri: string) => {
  try {
    await mongoose.connect(mongoUri, {});
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
};

export default connectDB;
