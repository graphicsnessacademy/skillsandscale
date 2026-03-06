import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import User from './models/User';

dotenv.config({ path: path.join(__dirname, '../.env') });

const seed = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected.");

    const email = "admin@skillsandscale.com";
    const password = "admin123";

    // Delete existing admin to avoid conflicts
    await User.deleteOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: "Master Admin",
      email: email,
      password: hashedPassword,
      role: "master-admin",
      phone: "0123456789"
    });

    console.log("---------------------------------------");
    console.log("👑 MASTER ADMIN CREATED SUCCESSFULLY");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log("---------------------------------------");
    
    process.exit();
  } catch (error) {
    console.error("❌ Seed Failed:", error);
    process.exit(1);
  }
};

seed();