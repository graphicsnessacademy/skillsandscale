import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';


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
            $slice: -10 // Keep last 10
          }
        }
      });

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