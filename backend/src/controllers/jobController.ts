import { Request, Response } from 'express';
import Job, { IJob } from '../models/Job';
import JobApplication, { IJobApplication } from '../models/JobApplication';
import User from '../models/User';
import { connectDB } from '../services/db';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Get all jobs with pagination
export const getJobs = async (req: Request, res: Response) => {
  try {
    await connectDB();
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Optional filters
    const { location, type, search } = req.query;
    
    let filter: any = { isActive: true };
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'institution.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit);
    
    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: page,
          totalPages,
          totalJobs,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch jobs'
    });
  }
};

// Get single job by ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    await connectDB();
    
    const { id } = req.params;
    console.log('getJobById called with ID:', id);
    
    // If ID is "user", this means the route is not working correctly
    if (id === 'user') {
      console.error('ERROR: getJobById called with "user" - routing issue detected!');
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID - routing configuration error'
      });
    }
    
    const job = await Job.findById(id).populate('postedBy', 'name email');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.json({
      success: true,
      data: job
    });
  } catch (error: any) {
    console.error('Error in getJobById:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch job'
    });
  }
};

// Create a new job (only for hospital/institution users)
export const createJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await connectDB();
    
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    // Check if user is from hospital/institution
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user's email is from hospital/institution domain
    const isInstitutionEmail = user.email.includes('@hospital') || 
                              user.email.includes('@medical') || 
                              user.accountType === 'Institution' ||
                              user.accountType === 'Hospital';
    
    if (!isInstitutionEmail) {
      return res.status(403).json({
        success: false,
        message: 'Only users with hospital/institution email can post jobs'
      });
    }
    
    const {
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      salary,
      location,
      type,
      experience,
      aboutInstitution,
      institution
    } = req.body;
    
    const job = await Job.create({
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      salary,
      location,
      type,
      experience,
      aboutInstitution,
      institution,
      postedBy: userId
    });
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to create job'
    });
  }
};

// Apply for a job
export const applyForJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await connectDB();
    
    const userId = req.userId;
    const { jobId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check if user already applied
    const existingApplication = await JobApplication.findOne({
      jobId,
      applicantId: userId
    });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }
    
    // Create application
    const application = await JobApplication.create({
      jobId,
      applicantId: userId
    });
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to apply for job'
    });
  }
};

// Get applications for a job (only for job poster)
export const getJobApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await connectDB();
    
    const userId = req.userId;
    const { jobId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    // Check if job exists and user is the poster
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (job.postedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view applications for jobs you posted'
      });
    }
    
    // Get applications with user details
    const applications = await JobApplication.find({ jobId })
      .populate('applicantId', 'name email bio headline profilePic')
      .sort({ appliedDate: -1 });
    
    res.json({
      success: true,
      data: applications
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch applications'
    });
  }
};

// Get user's job applications
export const getUserApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('getUserApplications called for userId:', req.userId);
    await connectDB();
    
    const userId = req.userId;
    
    if (!userId) {
      console.log('No userId found in request');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    console.log('Fetching applications for user:', userId);
    const applications = await JobApplication.find({ applicantId: userId })
      .populate('jobId', 'title institution location type salary')
      .sort({ appliedDate: -1 });
    
    console.log('Found applications:', applications.length);
    res.json({
      success: true,
      data: applications
    });
  } catch (error: any) {
    console.error('Error in getUserApplications:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch your applications'
    });
  }
};

// Get jobs posted by user
export const getUserJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await connectDB();
    
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    const jobs = await Job.find({ postedBy: userId })
      .sort({ postedDate: -1 });
    
    res.json({
      success: true,
      data: jobs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch your jobs'
    });
  }
};
