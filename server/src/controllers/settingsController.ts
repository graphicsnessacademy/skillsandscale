import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const getStaff = async (req: Request, res: Response) => {
    try {
        const staff = await User.find({ role: { $in: ['master-admin', 'sub-admin'] } }).select('-password');
        res.json(staff);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createSubAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'sub-admin'
        });

        res.status(201).json({ success: true, user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteStaff = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'master-admin') return res.status(403).json({ message: 'Cannot delete Master Admin' });

        await user.deleteOne();
        res.json({ success: true, message: 'Access revoked' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById((req as any).user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ success: true, message: 'Security updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStaff = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });


        if (user.role === 'master-admin') {
            return res.status(403).json({ message: 'Cannot modify Master Admin' });
        }

        user.name = name || user.name;
        user.email = email || user.email;


        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ success: true, message: 'Staff profile updated' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getLoginHistory = async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user._id).select('loginHistory');
        if (!user) return res.status(404).json({ message: 'User not found' });


        const history = user.loginHistory.reverse();
        res.json(history);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};