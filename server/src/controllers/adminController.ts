import { Request, Response } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import Service from '../models/Service';


const parseCoursePrice = (priceStr: string): number => {
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
};


export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      studentCount,
      courseCount,
      serviceCount,
      ongoingCount,
      pendingCerts,
      totalEnrollments,
      thisMonthEnrollments,
      lastMonthEnrollments,
      thisMonthStudents,
      lastMonthStudents,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Course.countDocuments(),
      Service.countDocuments(),
      Enrollment.countDocuments({ status: 'ongoing' }),
      Enrollment.countDocuments({ status: 'completed', 'certification.isCertified': false }),
      Enrollment.countDocuments({ 'paymentInfo.verificationStatus': 'verified' }),
      Enrollment.countDocuments({
        'paymentInfo.verificationStatus': 'verified',
        createdAt: { $gte: startOfThisMonth }
      }),
      Enrollment.countDocuments({
        'paymentInfo.verificationStatus': 'verified',
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfThisMonth } }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    ]);

    const verifiedEnrollments = await Enrollment
      .find({ 'paymentInfo.verificationStatus': 'verified' })
      .populate<{ course: { price: string; originalPrice: number } }>('course', 'price originalPrice');

    let totalRevenue = 0;
    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;

    verifiedEnrollments.forEach((enr: any) => {
      const amount = enr.course?.originalPrice
        ? enr.course.originalPrice
        : parseCoursePrice(enr.course?.price ?? '0');
      totalRevenue += amount;
      const createdAt = new Date(enr.createdAt);
      if (createdAt >= startOfThisMonth) thisMonthRevenue += amount;
      if (createdAt >= startOfLastMonth && createdAt <= endOfLastMonth) lastMonthRevenue += amount;
    });

    const growthPct = (current: number, previous: number) =>
      previous === 0 ? 100 : parseFloat((((current - previous) / previous) * 100).toFixed(1));

    const revenueGrowth = growthPct(thisMonthRevenue, lastMonthRevenue);
    const studentGrowth = growthPct(thisMonthStudents, lastMonthStudents);
    const enrollmentGrowth = growthPct(thisMonthEnrollments, lastMonthEnrollments);

    const monthlyRevenue: Record<string, number> = {};
    verifiedEnrollments.forEach((enr: any) => {
      const d = new Date(enr.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const amount = enr.course?.originalPrice
        ? enr.course.originalPrice
        : parseCoursePrice(enr.course?.price ?? '0');
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
    const weeklyEnrollments = await Enrollment.find({ createdAt: { $gte: weekAgo } });
    const weeklyMap: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    weeklyEnrollments.forEach((enr: any) => {
      const day = new Date(enr.createdAt).getDay();
      weeklyMap[day]++;
    });
    const trafficChart = DAY_LABELS.map((day, i) => ({ day, enrollments: weeklyMap[i] || 0 }));

    const allVerifiedWithCourse = await Enrollment
      .find({ 'paymentInfo.verificationStatus': 'verified' })
      .populate<{ course: { category: string } }>('course', 'category');

    const categoryMap: Record<string, number> = {};
    allVerifiedWithCourse.forEach((enr: any) => {
      const cat = enr.course?.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#8b5cf6'];
    const enrollmentMix = Object.entries(categoryMap).map(([name, count], i) => ({
      name,
      value: totalEnrollments > 0 ? Math.round((count / totalEnrollments) * 100) : 0,
      color: COLORS[i % COLORS.length],
    }));

    const recentEnrollments = await Enrollment
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate<{ course: { title: string; price: string; originalPrice: number } }>('course', 'title price originalPrice');

    const recentList = recentEnrollments.map((enr: any) => ({
      name: enr.personalInfo.fullName,
      course: enr.course?.title ?? 'Unknown Course',
      // ✅ BDT: ৳ symbol instead of $
      amount: enr.course?.originalPrice
        ? `৳${enr.course.originalPrice.toLocaleString('en-BD')}`
        : enr.course?.price
          ? `৳${parseCoursePrice(enr.course.price).toLocaleString('en-BD')}`
          : '৳0',
      status: enr.status,
      avatar: enr.personalInfo.fullName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
    }));

    const topCoursesAgg = await Enrollment.aggregate([
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

    const topCourses = topCoursesAgg.map((c: any) => {
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

  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch dashboard intelligence', error: error.message });
  }
};