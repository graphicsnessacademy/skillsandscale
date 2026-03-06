"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cloudinary_1 = require("../config/cloudinary");
const router = express_1.default.Router();
router.get('/', courseController_1.getCourses);
router.get('/:id', courseController_1.getCourseById);
router.post('/book', cloudinary_1.upload.single('receipt'), courseController_1.bookCourse);
router.post('/', authMiddleware_1.protect, authMiddleware_1.admin, cloudinary_1.upload.single('image'), courseController_1.createCourse);
router.put('/:id', authMiddleware_1.protect, authMiddleware_1.admin, cloudinary_1.upload.single('image'), courseController_1.updateCourse);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, courseController_1.deleteCourse);
exports.default = router;
