import { Request, Response } from 'express';
import Institution from '../models/Institution';
import Speciality from '../models/Speciality';
import City from '../models/City';
import { connectDB } from '../services/db';

export const getInstitutionsList = async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const institutions = await Institution.find({}, 'name');
    res.json({ success: true, data: institutions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch institutions' });
  }
};


export const getSpecialitiesList = async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const specialities = await Speciality.find({}, 'name');
    res.json({ success: true, data: specialities });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch specialities',
    });
  }
};


export const getCitiesList = async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const cities = await City.find({}, 'name');
    res.json({ success: true, data: cities });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch cities',
    });
  }
};

