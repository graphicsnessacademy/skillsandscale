"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cloudinary_1 = require("../config/cloudinary");
const router = express_1.default.Router();
router.get('/', teamController_1.getTeam);
router.post('/', authMiddleware_1.protect, authMiddleware_1.admin, teamController_1.createMember);
router.put('/:id', authMiddleware_1.protect, authMiddleware_1.admin, teamController_1.updateMember);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, teamController_1.deleteMember);
router.post('/upload', authMiddleware_1.protect, authMiddleware_1.admin, cloudinary_1.upload.single('image'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: 'No file uploaded' });
    res.json({ url: req.file.path });
});
exports.default = router;
