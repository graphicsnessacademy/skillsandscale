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
exports.getLoginHistory = exports.updateStaff = exports.updatePassword = exports.deleteStaff = exports.createSubAdmin = exports.getStaff = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield User_1.default.find({ role: { $in: ['master-admin', 'sub-admin'] } }).select('-password');
        res.json(staff);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getStaff = getStaff;
const createSubAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const userExists = yield User_1.default.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: 'User already exists' });
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield User_1.default.create({
            name,
            email,
            password: hashedPassword,
            role: 'sub-admin'
        });
        res.status(201).json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createSubAdmin = createSubAdmin;
const deleteStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (user.role === 'master-admin')
            return res.status(403).json({ message: 'Cannot delete Master Admin' });
        yield user.deleteOne();
        res.json({ success: true, message: 'Access revoked' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteStaff = deleteStaff;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = yield User_1.default.findById(req.user._id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Current password incorrect' });
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(newPassword, salt);
        yield user.save();
        res.json({ success: true, message: 'Security updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updatePassword = updatePassword;
const updateStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const user = yield User_1.default.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (user.role === 'master-admin') {
            return res.status(403).json({ message: 'Cannot modify Master Admin' });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        if (password && password.trim() !== '') {
            const salt = yield bcryptjs_1.default.genSalt(10);
            user.password = yield bcryptjs_1.default.hash(password, salt);
        }
        yield user.save();
        res.json({ success: true, message: 'Staff profile updated' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateStaff = updateStaff;
const getLoginHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id).select('loginHistory');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const history = user.loginHistory.reverse();
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getLoginHistory = getLoginHistory;
