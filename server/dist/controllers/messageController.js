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
exports.deleteMessage = exports.updateMessageStatus = exports.getMessages = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const notificationHelper_1 = require("../utils/notificationHelper");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newMessage = yield Message_1.default.create(req.body);
        // 🔔 NOTIFICATION
        yield (0, notificationHelper_1.triggerNotification)('business', 'New Message Received', `${req.body.name} sent a message: "${req.body.subject || ((_a = req.body.message) === null || _a === void 0 ? void 0 : _a.substring(0, 50))}..."`, '/admin/messages');
        res.status(201).json({ success: true, data: newMessage });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message_1.default.find({}).sort({ createdAt: -1 });
        const unreadCount = yield Message_1.default.countDocuments({ status: 'new' });
        res.json({ data: messages, unread: unreadCount });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getMessages = getMessages;
const updateMessageStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const message = yield Message_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ success: true, data: message });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateMessageStatus = updateMessageStatus;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Message_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message Purged' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteMessage = deleteMessage;
