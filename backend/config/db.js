import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log any errors that occur during connection and exit the process
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
