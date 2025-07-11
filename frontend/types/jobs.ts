export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  aboutInstitution: string;
  institution: {
    name: string;
    id: string;
  };
  postedBy: {
    _id: string;
    name: string;
    email: string;
  };
  postedDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  _id: string;
  jobId: Job | string;
  applicantId: {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    headline?: string;
    profilePic?: {
      url: string;
      fileId: string;
    };
  };
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  success: boolean;
  data: {
    jobs: Job[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalJobs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface JobResponse {
  success: boolean;
  data: Job;
}

export interface JobApplicationsResponse {
  success: boolean;
  data: JobApplication[];
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  aboutInstitution: string;
  institution: {
    name: string;
    id: string;
  };
}
