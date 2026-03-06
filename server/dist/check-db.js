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
const Enrollment_1 = __importDefault(require("./models/Enrollment"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const check = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI || "");
        console.log("-----------------------------------------");
        const userCount = yield User_1.default.countDocuments();
        console.log(`👥 Users Found: ${userCount}`);
        const enrollCount = yield Enrollment_1.default.countDocuments();
        console.log(`🎓 Enrollments Found: ${enrollCount}`);
        if (enrollCount > 0) {
            const sample = yield Enrollment_1.default.findOne();
            console.log("🔍 Sample Enrollment Data:", JSON.stringify(sample, null, 2));
        }
        else {
            console.log("❌ PROBLEM: No enrollments found. Run seed.ts!");
        }
        console.log("-----------------------------------------");
        process.exit();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
check();
