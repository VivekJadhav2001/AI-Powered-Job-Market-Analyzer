import mongoose from "mongoose"

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}

export default connectDB
