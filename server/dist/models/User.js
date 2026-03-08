"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, // Forces "Admin@Gmail.com" to "admin@gmail.com"
        trim: true,
        // Strict email regex validation
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        // Note: Hashing is handled by bcrypt in the auth controller
    },
    role: {
        type: String,
        enum: ['user', 'sub-admin', 'master-admin'],
        default: 'user',
    },
    phone: {
        type: String,
        default: '',
        trim: true,
    },
    enrolledCourses: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Course'
        }],
    loginHistory: [{
            device: String,
            browser: String,
            ip: String,
            date: { type: Date, default: Date.now }
        }]
}, {
    timestamps: true
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
