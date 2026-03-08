"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect Database
(0, db_1.default)();
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/courses', courseRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/team', teamRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/students', studentRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/admin/notifications', authMiddleware_1.protect, authMiddleware_1.admin, notificationRoutes_1.default);
// cPanel dynamic port handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
