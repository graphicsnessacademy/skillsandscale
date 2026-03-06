"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Import All Models
const User_1 = __importDefault(require("./models/User"));
const Course_1 = __importDefault(require("./models/Course"));
const Service_1 = __importDefault(require("./models/Service"));
const Team_1 = __importDefault(require("./models/Team"));
const Enrollment_1 = __importDefault(require("./models/Enrollment"));
const AuditLog_1 = __importDefault(require("./models/AuditLog"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const MONGO_URI = process.env.MONGO_URI || "";
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("⏳ Initializing SkillsandScale Business OS Registry Sync...");
        yield mongoose_1.default.connect(MONGO_URI);
        console.log("🍃 MongoDB Connection Established");
        // 1. CLEAR ALL COLLECTIONS (Fresh Start)
        yield Promise.all([
            User_1.default.deleteMany({}),
            Course_1.default.deleteMany({}),
            Service_1.default.deleteMany({}),
            Team_1.default.deleteMany({}),
            Enrollment_1.default.deleteMany({}),
            AuditLog_1.default.deleteMany({})
        ]);
        console.log("🧹 Vault Purged: Database is clean.");
        // 2. CREATE USERS
        const salt = yield bcryptjs_1.default.genSalt(10);
        const pass = yield bcryptjs_1.default.hash("admin123", salt);
        const studentPass = yield bcryptjs_1.default.hash("student123", salt);
        yield User_1.default.create({
            name: "Alex Morgan",
            email: "admin@skillsandscale.com",
            password: pass,
            role: "master-admin"
        });
        // Capture Student IDs for linking
        const s1 = yield User_1.default.create({ name: "John Doe", email: "john@example.com", password: pass, role: "user" });
        const s2 = yield User_1.default.create({ name: "Jane Smith", email: "jane@example.com", password: pass, role: "user" });
        console.log("👥 User Registry Synchronized.");
        // 3. CREATE COURSES
        const c1 = yield Course_1.default.create({
            title: "Full Stack Web Development BD",
            description: "Master the MERN stack from scratch.",
            price: "$299",
            duration: "12 Weeks",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            outline: [
                { moduleTitle: "React Context API", moduleSubtitle: "Detailed practical session." },
                { moduleTitle: "Node & Express", moduleSubtitle: "Backend logic." }
            ],
            students: 85,
            reviews: 32,
            category: "Development",
            nextBatch: "Oct 01"
        });
        const c2 = yield Course_1.default.create({
            title: "Mastering UI/UX Design",
            description: "Deep dive into Figma and Prototyping.",
            price: "$199",
            duration: "8 Weeks",
            image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c",
            outline: [
                { moduleTitle: "Figma Fundamentals", moduleSubtitle: "Vector tools." },
                { moduleTitle: "User Research", moduleSubtitle: "Personas mapping." }
            ],
            students: 150,
            reviews: 45,
            category: "Design",
            nextBatch: "Sept 15"
        });
        console.log(`📚 Academy Curriculum Live.`);
        // 4. CREATE ENROLLMENTS (THE FIX IS HERE)
        // We add 'as any' to bypass the strict type check on the array
        yield Enrollment_1.default.create([
            {
                student: s1._id,
                course: c1._id,
                personalInfo: {
                    fullName: "John Doe",
                    email: "john@example.com",
                    phone: "01711223344",
                    address: "Dhaka, Bangladesh"
                },
                courseInfo: { batchNumber: "B24-01" },
                paymentInfo: {
                    method: "Bkash",
                    transactionId: "TRX88229911",
                    screenshotUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
                    amount: "299"
                },
                status: "pending", // Will show 'Approve' button in Admin
                enrollmentDate: new Date()
            },
            {
                student: s2._id,
                course: c2._id,
                personalInfo: {
                    fullName: "Jane Smith",
                    email: "jane@example.com",
                    phone: "01822334455",
                    address: "Chittagong, BD"
                },
                courseInfo: { batchNumber: "D24-05" },
                paymentInfo: {
                    method: "Nagad",
                    transactionId: "NAG99112233",
                    screenshotUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
                    amount: "199"
                },
                status: "completed", // Will show Serial Number in Admin
                certification: {
                    isCertified: true,
                    isVerifiable: true,
                    serialNumber: "GA-2026-TEST-99",
                    issueDate: new Date(),
                    qrCodeString: "https://skillsandscale.com/verify/GA-2026-TEST-99"
                },
                enrollmentDate: new Date()
            }
        ]);
        console.log("🎓 Enrollment Registry Connected.");
        // 5. CREATE SERVICES
        yield Service_1.default.insertMany([
            { title: "Logo Design", category: "Design", icon: "PenTool", description: "Brand identity." },
            { title: "Banner Design", category: "Design", icon: "Image", description: "Web/Print banners." },
            { title: "Social Media Design", category: "Design", icon: "Share2", description: "Engaging posts." },
            { title: "Poster Design", category: "Design", icon: "Layout", description: "Event graphics." },
            { title: "Brochure Design", category: "Design", icon: "FileText", description: "Company profiles." },
            { title: "Flyer Design", category: "Design", icon: "Printer", description: "Marketing handouts." },
            { title: "Packaging Design", category: "Design", icon: "Box", description: "Product boxing." },
            { title: "T-shirt Design", category: "Design", icon: "Shirt", description: "Apparel artwork." },
            { title: "SEO Optimization", category: "Marketing", icon: "Search", description: "Google ranking." },
            { title: "Facebook Marketing", category: "Marketing", icon: "Facebook", description: "Targeted Ads." },
            { title: "Content Writing", category: "Marketing", icon: "Edit3", description: "SEO Copywriting." },
            { title: "Social Management", category: "Marketing", icon: "MessageCircle", description: "Handle handles." },
            { title: "Ad Managing", category: "Marketing", icon: "TrendingUp", description: "Budget optimization." },
            { title: "Marketing Advice", category: "Marketing", icon: "Globe", description: "Growth strategy." },
            { title: "Analytics & Strategy", category: "Marketing", icon: "BarChart", description: "Data insights." },
            { title: "SEM / PPC", category: "Marketing", icon: "Search", description: "Paid search leads." }
        ]);
        console.log(`🛠 Agency Service Catalog Distributed.`);
        // 6. CREATE TEAM
        yield Team_1.default.insertMany([
            { name: "Alex Morgan", role: "Founder & Creative Director", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a", phone: "+1234567890", email: "alex@skillsandscale.com" },
            { name: "Sarah Jenkins", role: "Head of Marketing", image: "https://images.unsplash.com/photo-1573496359-7973131e9271", phone: "+1987654321", email: "sarah@skillsandscale.com" },
            { name: "Michael Chen", role: "Lead UI/UX Designer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", phone: "+1122334455", email: "michael@skillsandscale.com" }
        ]);
        console.log(`👨‍💼 Agency Personnel Profiled.`);
        console.log("---------------------------------------");
        console.log("✅ DATA SEEDING COMPLETE");
        console.log("---------------------------------------");
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Seed Error:", err);
        process.exit(1);
    }
});
seedDB();
