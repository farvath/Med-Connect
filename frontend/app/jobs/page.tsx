"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Building2, Briefcase, Calendar, Share2, User, Users } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback, useRef } from "react"
import { apiFetch, apiPost } from "@/lib/api"
import { Job, JobsResponse, JobApplication, JobApplicationsResponse } from "@/types/jobs"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [showApplications, setShowApplications] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'posted' | 'applied'>('browse');
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [appliedJobsData, setAppliedJobsData] = useState<JobApplication[]>([]);
  const [loadingPosted, setLoadingPosted] = useState(false);
  const [loadingApplied, setLoadingApplied] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastJobElementRef = useRef<HTMLDivElement | null>(null);

  // Fetch jobs with filters and pagination
  const fetchJobs = useCallback(async (page: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      });
      
      if (searchTerm) params.append("search", searchTerm);
      if (locationFilter && locationFilter !== "all") params.append("location", locationFilter);
      if (typeFilter && typeFilter !== "all") params.append("type", typeFilter);
      
      const response = await apiFetch<JobsResponse['data']>(`/jobs?${params.toString()}`);
      
      // Handle the case where the response might not have the expected structure
      if (response && response.jobs) {
        if (reset) {
          setJobs(response.jobs);
        } else {
          setJobs(prev => [...prev, ...response.jobs]);
        }
        
        setHasNextPage(response.pagination.hasNextPage);
        setTotalJobs(response.pagination.totalJobs);
        setCurrentPage(response.pagination.currentPage);
      } else {
        // If API doesn't return expected structure, set empty state
        if (reset) {
          setJobs([]);
        }
        setHasNextPage(false);
        setTotalJobs(0);
        setCurrentPage(1);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
      // Set empty state on error
      if (reset) {
        setJobs([]);
      }
      setHasNextPage(false);
      setTotalJobs(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, locationFilter, typeFilter]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(1, true);
  };

  // Handle card click to open job details
  const handleCardClick = (job: Job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  // Handle job application
  const handleApplyJob = async (jobId: string) => {
    if (!user) {
      toast.error('Please login to apply for jobs');
      return;
    }

    try {
      await apiPost(`/jobs/${jobId}/apply`, {});
      setAppliedJobs(prev => new Set(prev).add(jobId));
      toast.success('Application submitted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply for job');
    }
  };

  // Get job applications for posted jobs
  const getJobApplications = async (jobId: string) => {
    try {
      const response = await apiFetch<JobApplication[]>(`/jobs/${jobId}/applications`);
      setJobApplications(response);
      setShowApplications(true);
    } catch (error: any) {
      toast.error('Failed to fetch applications');
    }
  };

  // Check if user can view applications (job poster)
  const canViewApplications = (job: Job) => {
    return user && job.postedBy && job.postedBy._id === user._id;
  };

  // Check if user is institution/hospital
  const isInstitutionUser = () => {
    return user && (user.accountType === 'Hospital' || user.accountType === 'Institution' || 
                    user.email.includes('@hospital') || user.email.includes('@medical'));
  };

  // Fetch jobs posted by current user
  const fetchPostedJobs = async () => {
    if (!user || !isInstitutionUser()) return;
    
    try {
      setLoadingPosted(true);
      const response = await apiFetch<JobsResponse['data']>('/jobs/user/posted');
      
      if (response && response.jobs) {
        setPostedJobs(response.jobs);
      } else {
        setPostedJobs([]);
      }
    } catch (error: any) {
      console.error('Error fetching posted jobs:', error);
      toast.error('Failed to fetch posted jobs');
      setPostedJobs([]);
    } finally {
      setLoadingPosted(false);
    }
  };

  // Fetch jobs user has applied to
  const fetchAppliedJobs = async () => {
    if (!user) return;
    
    try {
      setLoadingApplied(true);
      const response = await apiFetch<JobApplication[]>('/jobs/user/applications');
      setAppliedJobsData(response);
    } catch (error: any) {
      console.error('Error fetching applied jobs:', error);
      toast.error('Failed to fetch applied jobs');
      setAppliedJobsData([]);
    } finally {
      setLoadingApplied(false);
    }
  };

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchJobs(currentPage + 1, false);
        }
      },
      { threshold: 1.0 }
    );

    if (lastJobElementRef.current) {
      observerRef.current.observe(lastJobElementRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loading, hasNextPage, currentPage, fetchJobs]);

  // Initial load
  useEffect(() => {
    fetchJobs(1, true);
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'posted' && isInstitutionUser()) {
      fetchPostedJobs();
    } else if (activeTab === 'applied') {
      fetchAppliedJobs();
    }
  }, [activeTab, user]);

  // Fetch user's applied jobs
  useEffect(() => {
    const fetchUserApplications = async () => {
      if (!user) return;
      try {
        const response = await apiFetch<JobApplication[]>('/jobs/user/applications');
        const appliedJobIds = response.map(app => 
          typeof app.jobId === 'string' ? app.jobId : app.jobId._id
        );
        setAppliedJobs(new Set(appliedJobIds));
      } catch (error) {
        console.error('Failed to fetch user applications:', error);
      }
    };

    fetchUserApplications();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Medical Jobs</h1>
            <p className="text-gray-600 text-sm md:text-base">Find the best medical opportunities in top healthcare institutions</p>
          </div>

          {/* Search and Filters - Only show for browse tab */}
          {activeTab === 'browse' && (
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        placeholder="Search jobs, institutions..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>              <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Mangalore">Mangalore</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleSearch} 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
              >
                Search Jobs
              </Button>
            </div>
          )}

          {/* Results Count and Create Job Button */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 text-sm">
              {activeTab === 'browse' && `Showing ${jobs.length} of ${totalJobs} jobs`}
              {activeTab === 'posted' && `${postedJobs.length} jobs posted by you`}
              {activeTab === 'applied' && `${appliedJobsData.length} jobs you've applied to`}
            </p>
            {isInstitutionUser() && (
              <Link href="/jobs/create">
                <Button className="bg-green-600 hover:bg-green-700">
                  Post New Job
                </Button>
              </Link>
            )}
          </div>

          {/* Tabs for different sections */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'browse' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Browse Jobs
            </button>
            {isInstitutionUser() && (
              <button
                onClick={() => setActiveTab('posted')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'posted' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Posted Jobs
              </button>
            )}
            {user && (
              <button
                onClick={() => setActiveTab('applied')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'applied' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Applied Jobs
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Jobs Content based on active tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Browse Jobs Tab */}
        {activeTab === 'browse' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <Card 
                  key={job._id} 
                  className="hover:shadow-lg transition-shadow bg-white cursor-pointer"
                  ref={index === jobs.length - 1 ? lastJobElementRef : null}
                  onClick={() => handleCardClick(job)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg md:text-xl text-blue-900 mb-2">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {job.institution.name}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {job.experience}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{job.type}</Badge>
                        <Badge variant="secondary">{job.experience}</Badge>
                      </div>
                      
                      <div className="pt-4 space-y-2">
                        {!appliedJobs.has(job._id) ? (
                          <Button 
                            variant="outline" 
                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyJob(job._id);
                            }}
                          >
                            Apply Now
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full border-green-600 text-green-600 bg-green-50"
                            disabled
                          >
                            Applied
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading jobs...</span>
              </div>
            )}

            {/* No more jobs indicator */}
            {!loading && !hasNextPage && jobs.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">You've reached the end of the job listings</p>
              </div>
            )}

            {/* No jobs found */}
            {!loading && jobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("all");
                    setTypeFilter("all");
                    handleSearch();
                  }}
                  className="mt-4"
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* Posted Jobs Tab */}
        {activeTab === 'posted' && (
          <>
            {loadingPosted ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading your posted jobs...</span>
              </div>
            ) : postedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">You haven't posted any jobs yet</p>
                <Link href="/jobs/create">
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {postedJobs.map((job) => (
                  <Card key={job._id} className="bg-white">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-blue-900 mb-2">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {job.institution.name}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                onClick={() => getJobApplications(job._id)}
                              >
                                <Users className="w-4 h-4 mr-2" />
                                View Applications
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Applications for {job.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {jobApplications.length === 0 ? (
                                  <p className="text-gray-500 text-center py-8">No applications yet</p>
                                ) : (
                                  jobApplications.map((application) => (
                                    <Card key={application._id} className="p-4">
                                      <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                          {application.applicantId.profilePic?.url ? (
                                            <img 
                                              src={application.applicantId.profilePic.url} 
                                              alt={application.applicantId.name}
                                              className="w-12 h-12 rounded-full object-cover"
                                            />
                                          ) : (
                                            <User className="w-6 h-6 text-blue-600" />
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-semibold">{application.applicantId.name}</h4>
                                          <p className="text-sm text-gray-600">{application.applicantId.email}</p>
                                          {application.applicantId.headline && (
                                            <p className="text-sm text-gray-700 mt-1">{application.applicantId.headline}</p>
                                          )}
                                          {application.applicantId.bio && (
                                            <p className="text-sm text-gray-600 mt-2">{application.applicantId.bio}</p>
                                          )}
                                          <p className="text-xs text-gray-500 mt-2">
                                            Applied on {new Date(application.appliedDate).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <Link href={`/profile/${application.applicantId._id}`}>
                                            <Button variant="outline" size="sm">
                                              View Profile
                                            </Button>
                                          </Link>
                                        </div>
                                      </div>
                                    </Card>
                                  ))
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCardClick(job)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {job.experience}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(job.postedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700 mt-4" style={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden' 
                      }}>{job.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Applied Jobs Tab */}
        {activeTab === 'applied' && (
          <>
            {loadingApplied ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading your applications...</span>
              </div>
            ) : appliedJobsData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">You haven't applied to any jobs yet</p>
                <Button 
                  onClick={() => setActiveTab('browse')}
                  className="mt-4"
                  variant="outline"
                >
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {appliedJobsData.map((application) => {
                  const job = typeof application.jobId === 'string' ? null : application.jobId;
                  if (!job) return null;
                  
                  return (
                    <Card key={application._id} className="bg-white">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl text-blue-900 mb-2">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              {job.institution.name}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              variant={application.status === 'pending' ? 'secondary' : 
                                      application.status === 'accepted' ? 'default' : 'destructive'}
                            >
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCardClick(job)}
                            >
                              View Job
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {job.experience}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden' 
                        }}>{job.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Job Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedJob?.title}</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Institution</h3>
                  <p>{selectedJob.institution.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p>{selectedJob.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Job Type</h3>
                  <p>{selectedJob.type}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Experience</h3>
                  <p>{selectedJob.experience}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{selectedJob.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What You'll Do</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.responsibilities?.map((resp, index) => (
                    <li key={index} className="text-gray-700">{resp}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.requirements?.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Benefits</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.benefits?.map((benefit, index) => (
                    <li key={index} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">About the Institution</h3>
                <p className="text-gray-700">{selectedJob.aboutInstitution}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Salary</h3>
                <p className="text-gray-700">{selectedJob.salary}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700" 
                  onClick={() => handleApplyJob(selectedJob._id)}
                  disabled={appliedJobs.has(selectedJob._id)}
                >
                  {appliedJobs.has(selectedJob._id) ? 'Applied' : 'Apply Now'}
                </Button>
                {selectedJob.postedBy && canViewApplications(selectedJob) && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => getJobApplications(selectedJob._id)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        View Applications
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Applications for {selectedJob.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {jobApplications.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">No applications yet</p>
                        ) : (
                          jobApplications.map((application) => (
                            <Card key={application._id} className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  {application.applicantId.profilePic?.url ? (
                                    <img 
                                      src={application.applicantId.profilePic.url} 
                                      alt={application.applicantId.name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-6 h-6 text-blue-600" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{application.applicantId.name}</h4>
                                  <p className="text-sm text-gray-600">{application.applicantId.email}</p>
                                  {application.applicantId.headline && (
                                    <p className="text-sm text-gray-700 mt-1">{application.applicantId.headline}</p>
                                  )}
                                  {application.applicantId.bio && (
                                    <p className="text-sm text-gray-600 mt-2">{application.applicantId.bio}</p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-2">
                                    Applied on {new Date(application.appliedDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Link href={`/profile/${application.applicantId._id}`}>
                                    <Button variant="outline" size="sm">
                                      View Profile
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
