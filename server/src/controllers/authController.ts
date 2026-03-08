import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { triggerNotification } from '../utils/notificationHelper';

// Generate JWT Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {

      // Capture Login Data
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const ip = req.ip || req.headers['x-forwarded-for'] || 'Unknown';

      let device = 'Desktop';
      if (/mobile/i.test(userAgent)) device = 'Mobile';
      if (/tablet/i.test(userAgent)) device = 'Tablet';

      let browser = 'Unknown Browser';
      if (/chrome|crios/i.test(userAgent)) browser = 'Chrome';
      else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
      else if (/safari/i.test(userAgent)) browser = 'Safari';
      else if (/edge/i.test(userAgent)) browser = 'Edge';

      // Update Login History (keep last 10)
      const loginEntry = {
        device,
        browser,
        ip: String(ip),
        date: new Date()
      };

      await User.findByIdAndUpdate(user._id, {
        $push: {
          loginHistory: {
            $each: [loginEntry],
            $slice: -10
          }
        }
      });

      // 🔔 SECURITY NOTIFICATION — Admin logins only (master-admin eyes only)
      if (user.role === 'master-admin' || user.role === 'sub-admin') {
        await triggerNotification(
          'security',
          'Admin Login Detected',
          `${user.name} logged in via ${browser} on ${device} (IP: ${String(ip)}).`,
          '/admin/settings',
          'master-admin' // 🔒 Only visible to Master Admin
        );
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── CHANGE PASSWORD ──────────────────────────────────────────────────────────
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  const userId = (req as any).user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // 🔔 SECURITY NOTIFICATION — master-admin only
    await triggerNotification(
      'security',
      'Password Changed',
      `${user.name}'s account password was changed successfully.`,
      '/admin/settings',
      'master-admin' // 🔒 Only visible to Master Admin
    );

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};