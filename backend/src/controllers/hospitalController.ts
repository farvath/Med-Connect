import { Request, Response } from 'express';
import { HospitalModel } from '../models/Hospital';

export const getHospitals = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string || '';
    const location = req.query.location as string || '';
    const specialty = req.query.specialty as string || '';
    const sortBy = req.query.sortBy as string || 'rating';
    const sortOrder = req.query.sortOrder as string || 'desc';

    // Build search query
    const searchQuery: any = {};

    // Text search across name, location, and specialties
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { specialties: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Location filter
    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }

    // Specialty filter
    if (specialty) {
      searchQuery.specialties = { $in: [new RegExp(specialty, 'i')] };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const [hospitals, totalCount] = await Promise.all([
      HospitalModel.find(searchQuery)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      HospitalModel.countDocuments(searchQuery)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        hospitals,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage
        },
        filters: {
          search: search || null,
          location: location || null,
          specialty: specialty || null
        },
        sort: {
          sortBy,
          sortOrder: sortOrder as 'asc' | 'desc'
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch hospitals'
    });
  }
};

export const getHospitalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hospital = await HospitalModel.findById(id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    res.json({
      success: true,
      data: hospital
    });
  } catch (error: any) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch hospital'
    });
  }
};

export const getHospitalSpecialties = async (req: Request, res: Response) => {
  try {
    const specialties = await HospitalModel.distinct('specialties');
    res.json({
      success: true,
      data: specialties.sort()
    });
  } catch (error: any) {
    console.error('Error fetching hospital specialties:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch hospital specialties'
    });
  }
};

export const getHospitalLocations = async (req: Request, res: Response) => {
  try {
    const locations = await HospitalModel.distinct('location');
    res.json({
      success: true,
      data: locations.sort()
    });
  } catch (error: any) {
    console.error('Error fetching hospital locations:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch hospital locations'
    });
  }
};
