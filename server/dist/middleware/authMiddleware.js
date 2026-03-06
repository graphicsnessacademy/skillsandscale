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
exports.masterAdmin = exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// 1. PROTECT: Verify User is Logged In (Generic for all members)
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret123');
            // Find the user and attach to request (excluding password)
            req.user = yield User_1.default.findById(decoded.id).select('-password');
            return next(); // Successfully verified
        }
        catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
});
exports.protect = protect;
// 2. ADMIN: Check for Admin Privileges (Sub-Admin or Master-Admin)
// Use this for: Managing Courses, Services, Team, and Messages
const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'master-admin' || req.user.role === 'sub-admin')) {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};
exports.admin = admin;
// 3. MASTER ADMIN: Highest Level Security
// Use this for: Creating Sub-Admins, Deleting Admins, and Billing/Finance
const masterAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'master-admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied: Master Admin only' });
    }
};
exports.masterAdmin = masterAdmin;
