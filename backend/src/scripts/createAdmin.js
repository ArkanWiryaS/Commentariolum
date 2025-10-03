import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("❌ Admin already exists!");
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create({
      username: "admin",
      password: "admin123", // Will be hashed automatically
      name: "Administrator",
      email: "admin@tryout.com",
    });

    console.log("✅ Admin created successfully!");
    console.log("Username:", admin.username);
    console.log("Password: admin123");
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();

