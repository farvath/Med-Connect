import { Request, Response } from 'express';
import { CollegeModel } from '../models/college';
import { imagekitService } from '../services/imagekitService';

// Extend Request type for file upload (from multer)
interface CollegeRequest extends Request {
  file?: Express.Multer.File;
}

export const getCollegeList = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      search = '',
      location = '',
      programs = ''
    } = req.query;

    // Validate and convert query parameters
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 10)); // Max 50 items per page
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: any = {};

    // Search filter (name, shortName, or location)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Programs filter
    if (programs) {
      const programsArray = (programs as string).split(',').map(p => p.trim());
      filter.programs = { $in: programsArray.map(p => new RegExp(p, 'i')) };
    }

    // Build sort object
    const sortObj: any = {};
    const validSortFields = ['name', 'shortName', 'location', 'rating', 'established', 'students'];
    
    if (validSortFields.includes(sortBy as string)) {
      sortObj[sortBy as string] = sortDirection;
    } else {
      sortObj.name = 1; // Default sort by name ascending
    }

    // Execute query with pagination
    const [colleges, totalCount] = await Promise.all([
      CollegeModel.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean()
        .exec(),
      CollegeModel.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      success: true,
      data: {
        colleges,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNextPage,
          hasPrevPage
        },
        filters: {
          search: search || null,
          location: location || null,
          programs: programs ? (programs as string).split(',').map(p => p.trim()) : null
        },
        sort: {
          sortBy: sortBy || 'name',
          sortOrder: sortOrder || 'asc'
        }
      },
      message: 'Colleges fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching colleges:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const addCollege = async (req: CollegeRequest, res: Response) => {
  let uploadedImageData: { url: string; fileId: string } | null = null;

  try {
    const {
      name,
      shortName,
      location,
      students,
      established,
      rating,
      reviews,
      programs,
      overview,
      website,
      affiliations
    } = req.body;

    const imageFile = req.file; // Access the uploaded file via req.file

    // Validate required fields (excluding imageUrl since we'll upload it)
    if (!name || !shortName || !location || !students || !established || !rating || !reviews || !programs) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['name', 'shortName', 'location', 'students', 'established', 'rating', 'reviews', 'programs']
      });
    }

    // Validate rating range
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }

    // Handle image upload to ImageKit
    if (imageFile && imageFile.buffer) {
      try {
        const uploadResult = await imagekitService.upload(
          imageFile.buffer,
          imageFile.originalname,
          "/colleges" // Specify folder in ImageKit for colleges
        );
        uploadedImageData = {
          url: uploadResult.url,
          fileId: uploadResult.fileId,
        };
        
      } catch (uploadError: any) {
        console.error("Failed to upload college image to ImageKit:", uploadError.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload college image'
        });
      }
    }

    // Use uploaded image URL or default placeholder
    const imageUrl = uploadedImageData?.url || "/placeholder.svg";

    // Check if college with same name already exists
    const existingCollege = await CollegeModel.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { shortName: { $regex: new RegExp(`^${shortName}$`, 'i') } }
      ]
    });

    if (existingCollege) {
      return res.status(409).json({
        success: false,
        message: 'College with this name or short name already exists'
      });
    }

    // Parse programs and affiliations if they're strings
    const parsedPrograms = typeof programs === 'string' ? programs.split(',').map(p => p.trim()) : programs;
    const parsedAffiliations = affiliations ? (typeof affiliations === 'string' ? affiliations.split(',').map(a => a.trim()) : affiliations) : [];

    // Create new college
    const newCollege = new CollegeModel({
      name,
      shortName,
      location,
      students,
      established,
      rating: parseFloat(rating),
      reviews,
      programs: parsedPrograms,
      imageUrl,
      overview,
      website,
      affiliations: parsedAffiliations
    });

    const savedCollege = await newCollege.save();

    return res.status(201).json({
      success: true,
      data: savedCollege,
      message: 'College created successfully'
    });

  } catch (error: any) {
    console.error('Error creating college:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
