import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend Express Request to include the user object
export interface AuthRequest extends Request {
    user?: any;
}

// 1. PROTECT: Verify User is Logged In (Generic for all members)
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            // Find the user and attach to request (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            return next(); // Successfully verified
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 2. ADMIN: Check for Admin Privileges (Sub-Admin or Master-Admin)
// Use this for: Managing Courses, Services, Team, and Messages
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'master-admin' || req.user.role === 'sub-admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

// 3. MASTER ADMIN: Highest Level Security
// Use this for: Creating Sub-Admins, Deleting Admins, and Billing/Finance
export const masterAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'master-admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Master Admin only' });
    }
};

