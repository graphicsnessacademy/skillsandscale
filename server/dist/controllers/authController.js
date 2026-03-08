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
exports.changePassword = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const notificationHelper_1 = require("../utils/notificationHelper");
// Generate JWT Token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield User_1.default.create({
            name,
            email,
            password: hashedPassword,
            role: 'student',
        });
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            // Capture Login Data
            const userAgent = req.headers['user-agent'] || 'Unknown';
            const ip = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
            let device = 'Desktop';
            if (/mobile/i.test(userAgent))
                device = 'Mobile';
            if (/tablet/i.test(userAgent))
                device = 'Tablet';
            let browser = 'Unknown Browser';
            if (/chrome|crios/i.test(userAgent))
                browser = 'Chrome';
            else if (/firefox|fxios/i.test(userAgent))
                browser = 'Firefox';
            else if (/safari/i.test(userAgent))
                browser = 'Safari';
            else if (/edge/i.test(userAgent))
                browser = 'Edge';
            // Update Login History (keep last 10)
            const loginEntry = {
                device,
                browser,
                ip: String(ip),
                date: new Date()
            };
            yield User_1.default.findByIdAndUpdate(user._id, {
                $push: {
                    loginHistory: {
                        $each: [loginEntry],
                        $slice: -10
                    }
                }
            });
            // 🔔 SECURITY NOTIFICATION — Admin logins only (master-admin eyes only)
            if (user.role === 'master-admin' || user.role === 'sub-admin') {
                yield (0, notificationHelper_1.triggerNotification)('security', 'Admin Login Detected', `${user.name} logged in via ${browser} on ${device} (IP: ${String(ip)}).`, '/admin/settings', 'master-admin' // 🔒 Only visible to Master Admin
                );
            }
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
// ── CHANGE PASSWORD ──────────────────────────────────────────────────────────
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Current password is incorrect' });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(newPassword, salt);
        yield user.save();
        // 🔔 SECURITY NOTIFICATION — master-admin only
        yield (0, notificationHelper_1.triggerNotification)('security', 'Password Changed', `${user.name}'s account password was changed successfully.`, '/admin/settings', 'master-admin' // 🔒 Only visible to Master Admin
        );
        res.json({ success: true, message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.changePassword = changePassword;
