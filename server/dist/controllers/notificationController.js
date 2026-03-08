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
exports.notifyNewInquiry = exports.notifyNewEnrollment = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.createTestNotification = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const role = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || 'sub-admin';
        // Master Admin sees all. Sub-admin only sees 'all' category.
        const filter = role === 'master-admin' ? {} : { forRole: 'all' };
        const notifications = yield Notification_1.default.find(filter).sort({ createdAt: -1 }).limit(30);
        const unreadCount = yield Notification_1.default.countDocuments(Object.assign(Object.assign({}, filter), { isRead: false }));
        res.status(200).json({ notifications, unreadCount });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});
exports.getNotifications = getNotifications;
// --- TEST FUNCTION: Call this to prove the panel works ---
const createTestNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const testNotif = yield Notification_1.default.create({
            category: 'business',
            title: 'System Test Success',
            message: 'The notification signal is reaching the dashboard perfectly! 🚀',
            link: '/admin',
            forRole: 'all'
        });
        res.status(201).json(testNotif);
    }
    catch (error) {
        res.status(500).json({ message: 'Test failed' });
    }
});
exports.createTestNotification = createTestNotification;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification_1.default.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to mark as read' });
    }
});
exports.markAsRead = markAsRead;
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const role = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || 'sub-admin';
        const filter = role === 'master-admin' ? {} : { forRole: 'all' };
        yield Notification_1.default.updateMany(Object.assign(Object.assign({}, filter), { isRead: false }), { isRead: true });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to mark all as read' });
    }
});
exports.markAllAsRead = markAllAsRead;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete notification' });
    }
});
exports.deleteNotification = deleteNotification;
// --- HELPER FUNCTIONS (Call these from other controllers) ---
const notifyNewEnrollment = (studentName, courseName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification_1.default.create({
            category: 'business', title: 'New Enrollment',
            message: `${studentName} just enrolled in ${courseName}.`,
            link: '/admin/students', forRole: 'all',
        });
    }
    catch (err) {
        console.error('Notification Error:', err);
    }
});
exports.notifyNewEnrollment = notifyNewEnrollment;
const notifyNewInquiry = (senderName, subject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification_1.default.create({
            category: 'business', title: 'New Inquiry',
            message: `Message from ${senderName}: ${subject}`,
            link: '/admin/messages', forRole: 'all',
        });
    }
    catch (err) {
        console.error('Notification Error:', err);
    }
});
exports.notifyNewInquiry = notifyNewInquiry;
