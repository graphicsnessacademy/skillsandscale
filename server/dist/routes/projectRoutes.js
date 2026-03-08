"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cloudinary_1 = require("../config/cloudinary");
const router = express_1.default.Router();
router.get('/', projectController_1.getProjects);
router.post('/', authMiddleware_1.protect, authMiddleware_1.admin, cloudinary_1.upload.single('image'), projectController_1.updateProjectSlot);
exports.default = router;
