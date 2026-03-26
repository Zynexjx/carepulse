const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    console.warn("Server running without database. Update MONGO_URI in .env with a valid connection string.");
  }
};

module.exports = connectDB;