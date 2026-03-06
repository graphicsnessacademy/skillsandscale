import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Enrollment from './models/Enrollment';
import User from './models/User';

dotenv.config({ path: path.join(__dirname, '../.env') });

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("-----------------------------------------");
    
    const userCount = await User.countDocuments();
    console.log(`👥 Users Found: ${userCount}`);
    
    const enrollCount = await Enrollment.countDocuments();
    console.log(`🎓 Enrollments Found: ${enrollCount}`);

    if (enrollCount > 0) {
      const sample = await Enrollment.findOne();
      console.log("🔍 Sample Enrollment Data:", JSON.stringify(sample, null, 2));
    } else {
      console.log("❌ PROBLEM: No enrollments found. Run seed.ts!");
    }
    
    console.log("-----------------------------------------");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();