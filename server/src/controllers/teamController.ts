import { Request, Response } from 'express';
import Team from '../models/Team';



export const getTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.find({}).sort({ createdAt: -1 });

    const stats = {
      total: team.length,
      developers: team.filter(m => m.role.toLowerCase().includes('developer')).length,
      designers: team.filter(m => m.role.toLowerCase().includes('designer')).length,
      marketers: team.filter(m => m.role.toLowerCase().includes('marketing') || m.role.toLowerCase().includes('strategist')).length,
    };

    res.json({ team, stats });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const createMember = async (req: Request, res: Response) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json(member);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(member);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Member deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};