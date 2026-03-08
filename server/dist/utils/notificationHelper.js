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
exports.triggerNotification = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
/**
 * Triggers a system-wide notification for Admins
 * @param category 'business' (sales/leads) | 'academic' (course status/certs) | 'security' (passwords/logins)
 * @param forRole 'all' (visible to sub-admins) | 'master-admin' (sensitive logs)
 */
const triggerNotification = (category_1, title_1, message_1, link_1, ...args_1) => __awaiter(void 0, [category_1, title_1, message_1, link_1, ...args_1], void 0, function* (category, title, message, link, forRole = 'all') {
    try {
        yield Notification_1.default.create({
            category,
            title,
            message,
            link,
            forRole,
            isRead: false
        });
        console.log(`🔔 Notification Created: [${category.toUpperCase()}] ${title}`);
    }
    catch (error) {
        console.error("❌ Notification Engine Error:", error);
    }
});
exports.triggerNotification = triggerNotification;
