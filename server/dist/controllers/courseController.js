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
exports.bookCourse = exports.updateCourse = exports.deleteCourse = exports.createCourse = exports.getCourseById = exports.getCourses = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course_1.default.find({}).sort({ createdAt: -1 }); // Newest first
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCourses = getCourses;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield Course_1.default.findById(req.params.id);
        if (course) {
            res.json(course);
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCourseById = getCourseById;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file)
            return res.status(400).json({ message: 'Course image is required' });
        // Destructure new fields
        const { title, description, duration, category, nextBatch, batchName, outline, originalPrice, discount, price, // Pricing fields
        students, reviews } = req.body;
        const parsedOutline = typeof outline === 'string' ? JSON.parse(outline) : outline;
        const course = new Course_1.default({
            title, description, duration, category, batchName, nextBatch,
            originalPrice, discount, price, // Save pricing logic
            students, reviews,
            image: req.file.path,
            outline: parsedOutline
        });
        const createdCourse = yield course.save();
        res.status(201).json(createdCourse);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create course', error: error.message });
    }
});
exports.createCourse = createCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield Course_1.default.findById(req.params.id);
        if (course) {
            yield course.deleteOne();
            res.json({ message: 'Course removed' });
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteCourse = deleteCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield Course_1.default.findById(req.params.id);
        if (!course)
            return res.status(404).json({ message: 'Course not found' });
        const { title, description, duration, category, nextBatch, batchName, outline, originalPrice, discount, price, students, reviews } = req.body;
        // Update fields
        if (title)
            course.title = title;
        if (description)
            course.description = description;
        if (duration)
            course.duration = duration;
        if (category)
            course.category = category;
        if (nextBatch)
            course.nextBatch = nextBatch;
        if (batchName)
            course.batchName = batchName;
        if (students)
            course.students = students;
        if (reviews)
            course.reviews = reviews;
        // Update Pricing
        if (originalPrice)
            course.originalPrice = originalPrice;
        if (discount !== undefined)
            course.discount = discount;
        if (price)
            course.price = price;
        if (req.file)
            course.image = req.file.path;
        if (outline)
            course.outline = typeof outline === 'string' ? JSON.parse(outline) : outline;
        const updatedCourse = yield course.save();
        res.json(updatedCourse);
    }
    catch (error) {
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
});
exports.updateCourse = updateCourse;
const bookCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Check if file exists
        if (!req.file) {
            res.status(400).json({ message: 'Receipt screenshot is required' });
            return;
        }
        // 2. Extract Text Data (FormData sends everything as strings)
        const { courseId, studentId, // Optional: if user is logged in
        fullName, email, phone, address, batchNumber, transactionId, paymentMethod } = req.body;
        // 3. Create Enrollment Object
        const enrollment = new Enrollment_1.default({
            student: studentId || null, // Link to user if available
            course: courseId,
            personalInfo: {
                fullName,
                email,
                phone,
                address
            },
            courseInfo: {
                batchNumber
            },
            paymentInfo: {
                method: paymentMethod || 'Bank Transfer',
                transactionId,
                screenshotUrl: req.file.path, // Cloudinary URL
                verificationStatus: 'pending'
            },
            status: 'pending'
        });
        // 4. Save to DB
        yield enrollment.save();
        res.status(201).json({ message: 'Booking submitted successfully!', enrollmentId: enrollment._id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Booking failed', error: error.message });
    }
});
exports.bookCourse = bookCourse;
