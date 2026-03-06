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
exports.notifyFailedLogins = exports.notifyNewAdminAdded = exports.notifyLowSeats = exports.notifyCertificateGenerated = exports.notifyNewInquiry = exports.notifyNewEnrollment = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const role = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== null && _b !== void 0 ? _b : 'sub-admin';
        const filter = role === 'master-admin' ? {} : { forRole: 'all' };
        const notifications = yield Notification_1.default.find(filter).sort({ createdAt: -1 }).limit(30);
        const unreadCount = yield Notification_1.default.countDocuments(Object.assign(Object.assign({}, filter), { isRead: false }));
        res.status(200).json({ notifications, unreadCount });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
    }
});
exports.getNotifications = getNotifications;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification_1.default.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to mark as read', error: error.message });
    }
});
exports.markAsRead = markAsRead;
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const role = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== null && _b !== void 0 ? _b : 'sub-admin';
        const filter = role === 'master-admin' ? {} : { forRole: 'all' };
        yield Notification_1.default.updateMany(Object.assign(Object.assign({}, filter), { isRead: false }), { isRead: true });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to mark all as read', error: error.message });
    }
});
exports.markAllAsRead = markAllAsRead;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete notification', error: error.message });
    }
});
exports.deleteNotification = deleteNotification;
const notifyNewEnrollment = (studentName, courseName) => __awaiter(void 0, void 0, void 0, function* () {
    yield Notification_1.default.create({
        category: 'business', title: 'New Enrollment',
        message: `New Student: ${studentName} enrolled in ${courseName}.`,
        link: '/admin/students', forRole: 'all',
    });
});
exports.notifyNewEnrollment = notifyNewEnrollment;
const notifyNewInquiry = (senderName, subject) => __awaiter(void 0, void 0, void 0, function* () {
    yield Notification_1.default.create({
        category: 'business', title: 'New Inquiry',
        message: `New message from ${senderName} regarding ${subject}.`,
        link: '/admin/messages', forRole: 'all',
    });
});
exports.notifyNewInquiry = notifyNewInquiry;
const notifyCertificateGenerated = (studentName, batchName) => __awaiter(void 0, void 0, void 0, function* () {
    yield Notification_1.default.create({
        category: 'academic', title: 'Certificate Generated',
        message: `Certificate generated for ${studentName} (${batchName}).`,
        link: '/admin/students', forRole: 'all',
    });
});
exports.notifyCertificateGenerated = notifyCertificateGenerated;
const notifyLowSeats = (courseName, remainingSeats) => __awaiter(void 0, void 0, void 0, function* () {
    yield Notification_1.default.create({
        category: 'academic', title: 'Low Seat Alert',
        message: `Only ${remainingSeats} seat(s) left in ${courseName}.`,
        link: '/admin/courses', forRole: 'all',
    });
});
exports.notifyLowSeats = notifyLowSeats;
const notifyNewAdminAdded = (adminName) => __awaiter(void 0, void 0, void 0, function* () {
    yield Notification_1.default.create({
        category: 'security', title: 'New Admin Added',
        message: `Sub-admin account created for ${adminName}.`,
        link: '/admin/settings', forRole: 'master-admin',
    });
});
exports.notifyNewAdminAdded = notifyNewAdminAdded;
const notifyFailedLogins = (email, attempts) => __awaiter(void 0, void 0, void 0, function* () {
    yield Notification_1.default.create({
        category: 'security', title: 'Failed Login Attempts',
        message: `${attempts} failed login attempts detected for ${email}.`,
        link: '/admin/settings', forRole: 'master-admin',
    });
});
exports.notifyFailedLogins = notifyFailedLogins;
