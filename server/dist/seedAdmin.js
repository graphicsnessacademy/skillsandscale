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
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("⏳ Connecting to MongoDB...");
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("✅ Connected.");
        const email = "admin@skillsandscale.com";
        const password = "admin123";
        // Delete existing admin to avoid conflicts
        yield User_1.default.deleteOne({ email });
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        yield User_1.default.create({
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
    }
    catch (error) {
        console.error("❌ Seed Failed:", error);
        process.exit(1);
    }
});
seed();
