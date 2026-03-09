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
exports.getDashboardStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const Course_1 = __importDefault(require("../models/Course"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const Service_1 = __importDefault(require("../models/Service"));
const parseCoursePrice = (priceStr) => {
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
};
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const [studentCount, courseCount, serviceCount, ongoingCount, pendingCerts, totalEnrollments, thisMonthEnrollments, lastMonthEnrollments, thisMonthStudents, lastMonthStudents,] = yield Promise.all([
            User_1.default.countDocuments({ role: 'user' }),
            Course_1.default.countDocuments(),
            Service_1.default.countDocuments(),
            Enrollment_1.default.countDocuments({ status: 'ongoing' }),
            Enrollment_1.default.countDocuments({ status: 'completed', 'certification.isCertified': false }),
            Enrollment_1.default.countDocuments({ 'paymentInfo.verificationStatus': 'verified' }),
            Enrollment_1.default.countDocuments({
                'paymentInfo.verificationStatus': 'verified',
                createdAt: { $gte: startOfThisMonth }
            }),
            Enrollment_1.default.countDocuments({
                'paymentInfo.verificationStatus': 'verified',
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
            }),
            User_1.default.countDocuments({ role: 'user', createdAt: { $gte: startOfThisMonth } }),
            User_1.default.countDocuments({ role: 'user', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        ]);
        const verifiedEnrollments = yield Enrollment_1.default
            .find({ 'paymentInfo.verificationStatus': 'verified' })
            .populate('course', 'price originalPrice');
        let totalRevenue = 0;
        let thisMonthRevenue = 0;
        let lastMonthRevenue = 0;
        verifiedEnrollments.forEach((enr) => {
            var _a, _b, _c;
            const amount = ((_a = enr.course) === null || _a === void 0 ? void 0 : _a.originalPrice)
                ? enr.course.originalPrice
                : parseCoursePrice((_c = (_b = enr.course) === null || _b === void 0 ? void 0 : _b.price) !== null && _c !== void 0 ? _c : '0');
            totalRevenue += amount;
            const createdAt = new Date(enr.createdAt);
            if (createdAt >= startOfThisMonth)
                thisMonthRevenue += amount;
            if (createdAt >= startOfLastMonth && createdAt <= endOfLastMonth)
                lastMonthRevenue += amount;
        });
        const growthPct = (current, previous) => previous === 0 ? 100 : parseFloat((((current - previous) / previous) * 100).toFixed(1));
        const revenueGrowth = growthPct(thisMonthRevenue, lastMonthRevenue);
        const studentGrowth = growthPct(thisMonthStudents, lastMonthStudents);
        const enrollmentGrowth = growthPct(thisMonthEnrollments, lastMonthEnrollments);
        const monthlyRevenue = {};
        verifiedEnrollments.forEach((enr) => {
            var _a, _b, _c;
            const d = new Date(enr.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const amount = ((_a = enr.course) === null || _a === void 0 ? void 0 : _a.originalPrice)
                ? enr.course.originalPrice
                : parseCoursePrice((_c = (_b = enr.course) === null || _b === void 0 ? void 0 : _b.price) !== null && _c !== void 0 ? _c : '0');
            monthlyRevenue[key] = (monthlyRevenue[key] || 0) + amount;
        });
        const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueChart = Array.from({ length: 12 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return {
                month: MONTH_LABELS[d.getMonth()],
                revenue: monthlyRevenue[key] || 0,
            };
        });
        const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weeklyEnrollments = yield Enrollment_1.default.find({ createdAt: { $gte: weekAgo } });
        const weeklyMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        weeklyEnrollments.forEach((enr) => {
            const day = new Date(enr.createdAt).getDay();
            weeklyMap[day]++;
        });
        const trafficChart = DAY_LABELS.map((day, i) => ({ day, enrollments: weeklyMap[i] || 0 }));
        const allVerifiedWithCourse = yield Enrollment_1.default
            .find({ 'paymentInfo.verificationStatus': 'verified' })
            .populate('course', 'category');
        const categoryMap = {};
        allVerifiedWithCourse.forEach((enr) => {
            var _a;
            const cat = ((_a = enr.course) === null || _a === void 0 ? void 0 : _a.category) || 'Other';
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
        const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#8b5cf6'];
        const enrollmentMix = Object.entries(categoryMap).map(([name, count], i) => ({
            name,
            value: totalEnrollments > 0 ? Math.round((count / totalEnrollments) * 100) : 0,
            color: COLORS[i % COLORS.length],
        }));
        const recentEnrollments = yield Enrollment_1.default
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('course', 'title price originalPrice');
        const recentList = recentEnrollments.map((enr) => {
            var _a, _b, _c, _d;
            return ({
                name: enr.personalInfo.fullName,
                course: (_b = (_a = enr.course) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : 'Unknown Course',
                // ✅ BDT: ৳ symbol instead of $
                amount: ((_c = enr.course) === null || _c === void 0 ? void 0 : _c.originalPrice)
                    ? `৳${enr.course.originalPrice.toLocaleString('en-BD')}`
                    : ((_d = enr.course) === null || _d === void 0 ? void 0 : _d.price)
                        ? `৳${parseCoursePrice(enr.course.price).toLocaleString('en-BD')}`
                        : '৳0',
                status: enr.status,
                avatar: enr.personalInfo.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
            });
        });
        const topCoursesAgg = yield Enrollment_1.default.aggregate([
            { $match: { 'paymentInfo.verificationStatus': 'verified' } },
            { $group: { _id: '$course', enrollmentCount: { $sum: 1 } } },
            { $sort: { enrollmentCount: -1 } },
            { $limit: 4 },
            { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'courseData' } },
            { $unwind: '$courseData' },
            {
                $project: {
                    title: '$courseData.title',
                    students: '$enrollmentCount',
                    rating: '$courseData.reviews',
                    price: '$courseData.price',
                    originalPrice: '$courseData.originalPrice',
                }
            }
        ]);
        const topCourses = topCoursesAgg.map((c) => {
            const rev = (c.originalPrice || parseCoursePrice(c.price || '0')) * c.students;
            return {
                title: c.title,
                students: c.students,
                rating: c.rating || 0,
                // ✅ BDT: ৳ symbol instead of $
                revenue: `৳${rev.toLocaleString('en-BD')}`,
            };
        });
        res.status(200).json({
            totalRevenue,
            activeStudents: studentCount,
            totalCourses: courseCount,
            totalServices: serviceCount,
            ongoingEnrollments: ongoingCount,
            pendingCertificates: pendingCerts,
            unreadMessages: 0,
            revenueGrowth,
            studentGrowth,
            enrollmentGrowth,
            revenueChart,
            trafficChart,
            enrollmentMix,
            recentEnrollments: recentList,
            topCourses,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard intelligence', error: error.message });
    }
});
exports.getDashboardStats = getDashboardStats;
