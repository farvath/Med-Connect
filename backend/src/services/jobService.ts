   import Job, { IJob } from '../models/Job';
import JobApplication, { IJobApplication } from '../models/JobApplication';
import { connectDB } from './db';

// Service function to get jobs with filters and pagination
export const getJobsWithFilters = async (filters: any, page: number = 1, limit: number = 10) => {
  await connectDB();
  
  const skip = (page - 1) * limit;
  let filter: any = { isActive: true };
  
  if (filters.location) {
    filter.location = { $regex: filters.location, $options: 'i' };
  }
  
  if (filters.type) {
    filter.type = filters.type;
  }
  
  if (filters.search) {
    filter.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { 'institution.name': { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  const jobs = await Job.find(filter)
    .populate('postedBy', 'name email')
    .sort({ postedDate: -1 })
    .skip(skip)
    .limit(limit);
  
  const totalJobs = await Job.countDocuments(filter);
  const totalPages = Math.ceil(totalJobs / limit);
  
  return {
    jobs,
    pagination: {
      currentPage: page,
      totalPages,
      totalJobs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

// Service function to check if user can apply for a job
export const canUserApplyForJob = async (userId: string, jobId: string) => {
  const existingApplication = await JobApplication.findOne({
    jobId,
    applicantId: userId
  });
  
  return !existingApplication;
};

// Service function to get user's applied jobs
export const getUserAppliedJobs = async (userId: string) => {
  return await JobApplication.find({ applicantId: userId })
    .populate('jobId', 'title institution location type salary')
    .sort({ appliedDate: -1 });
};

// Service function to get applications for a specific job
export const getJobApplicationsWithDetails = async (jobId: string) => {
  return await JobApplication.find({ jobId })
    .populate('applicantId', 'name email bio headline profilePic')
    .sort({ appliedDate: -1 });
};