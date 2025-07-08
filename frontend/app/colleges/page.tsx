'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, MapPin, Star, Search, Users, BookOpen, Globe, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { College, CollegeQueryParams, CollegeListResponse } from "@/types/colleges";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, apiPost } from "@/lib/api";

const ITEMS_PER_LOAD = 10;

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddCollegeModalOpen, setIsAddCollegeModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [totalCount, setTotalCount] = useState(0);
  
  // Use Auth context instead of making separate API call
  const { isLoggedIn } = useAuth();

  const observerTarget = useRef(null);
  const { toast } = useToast();

  const fetchColleges = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const queryParams: CollegeQueryParams = {
        page: pageNum,
        limit: ITEMS_PER_LOAD,
        sortBy,
        sortOrder,
        search: searchTerm || undefined,
        location: locationFilter !== 'all' ? locationFilter : undefined,
        programs: programFilter !== 'all' ? programFilter : undefined
      };

      const response: CollegeListResponse['data'] = await apiFetch<CollegeListResponse['data']>("/colleges/getCollegeList", {
        params: queryParams
      });
      
      // Handle empty response
      if (!response.colleges || response.colleges.length === 0) {
        if (reset) {
          setColleges([]);
        }
        setHasMore(false);
        setTotalCount(response.pagination?.totalCount || 0);
        return;
      }
      
      if (reset) {
        setColleges(response.colleges);
      } else {
        setColleges(prev => [...prev, ...response.colleges]);
      }
      
      setTotalCount(response.pagination.totalCount);
      setHasMore(response.pagination.hasNextPage);
      
    } catch (error) {
      console.error('Error fetching colleges:', error);
      // Set hasMore to false on error to prevent infinite requests
      setHasMore(false);
      toast({
        title: "Error",
        description: "Failed to fetch colleges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, locationFilter, programFilter, sortBy, sortOrder, loading, toast]);

  // Reset and fetch when filters change
  useEffect(() => {
    setColleges([]);
    setPage(1);
    setHasMore(true);
    fetchColleges(1, true);
  }, [searchTerm, locationFilter, programFilter, sortBy, sortOrder]);

  // Infinite scroll observer
  useEffect(() => {
    // Don't set up observer if there are no colleges and no more to load
    if (!hasMore || (colleges.length === 0 && !loading)) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && colleges.length > 0) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchColleges(nextPage, false);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, page, fetchColleges, colleges.length]);

  const handleViewDetails = async (collegeId: string) => {
    const collegeDetails = colleges.find(c => c._id === collegeId);
    setSelectedCollege(collegeDetails || null);
    setIsDetailsModalOpen(true);
  };

  const handleAddCollege = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const programs = (formData.get('programs') as string).split(',').map(p => p.trim());
      const affiliations = (formData.get('affiliations') as string).split(',').map(a => a.trim());
      
      const newCollegeData = {
        name: formData.get('collegeName') as string,
        shortName: formData.get('shortName') as string,
        location: formData.get('location') as string,
        students: formData.get('students') as string,
        established: formData.get('established') as string,
        rating: parseFloat(formData.get('rating') as string) || 0,
        reviews: formData.get('reviews') as string || "0 reviews",
        programs,
        imageUrl: formData.get('imageUrl') as string || "/placeholder.svg",
        overview: formData.get('overview') as string,
        website: formData.get('website') as string,

        affiliations
      };

      await apiFetch<College>("/colleges/addCollege", {
        method: 'POST',
        data: newCollegeData
      });
      
      toast({
        title: "Success",
        description: "College added successfully!",
      });
      
      setIsAddCollegeModalOpen(false);
      // Refresh the list
      setColleges([]);
      setPage(1);
      setHasMore(true);
      fetchColleges(1, true);
      
    } catch (error) {
      console.error('Error adding college:', error);
      toast({
        title: "Error",
        description: "Failed to add college. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Search with debounce
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      setSearchTerm(value);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Medical Colleges</h1>
            <p className="text-gray-600">
              Explore {totalCount > 0 ? `${totalCount} ` : ''}top medical institutions and programs
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Conditionally render Add College button only if user is logged in */}
            {isLoggedIn && (
              <Dialog open={isAddCollegeModalOpen} onOpenChange={setIsAddCollegeModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Building2 className="w-4 h-4 mr-2" />
                    Add College
                  </Button>
                </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New College</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new medical college.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCollege} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="collegeName">College Name</Label>
                    <Input id="collegeName" name="collegeName" required />
                  </div>
                  <div>
                    <Label htmlFor="shortName">Short Name</Label>
                    <Input id="shortName" name="shortName" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="students">Student Count</Label>
                    <Input id="students" name="students" placeholder="e.g., 2000+ students" required />
                  </div>
                  <div>
                    <Label htmlFor="established">Established</Label>
                    <Input id="established" name="established" placeholder="e.g., Established 1950" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input id="rating" name="rating" type="number" min="0" max="5" step="0.1" />
                  </div>
                  <div>
                    <Label htmlFor="reviews">Reviews</Label>
                    <Input id="reviews" name="reviews" placeholder="e.g., 2.5k reviews" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="programs">Programs (comma-separated)</Label>
                  <Input id="programs" name="programs" placeholder="e.g., MBBS, MD, Research" required />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" name="imageUrl" type="url" />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" type="url" />
                </div>
        
                <div>
                  <Label htmlFor="affiliations">Affiliations (comma-separated)</Label>
                  <Input id="affiliations" name="affiliations" placeholder="e.g., MCI Approved, WHO Recognized" />
                </div>
                <div>
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea id="overview" name="overview" rows={3} />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add College"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search colleges"
                className="pl-10"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="New Delhi">Delhi</SelectItem>
                <SelectItem value="Vellore">Vellore</SelectItem>
                <SelectItem value="Puducherry">Puducherry</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                 <SelectItem value="Kashmir">Kashmir</SelectItem>
              </SelectContent>
            </Select>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Program Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="MBBS">MBBS</SelectItem>
                <SelectItem value="MD">MD</SelectItem>
                <SelectItem value="Nursing">Nursing</SelectItem>
                <SelectItem value="PG">PG</SelectItem>
                <SelectItem value="Super Specialty">Super Specialty</SelectItem>
                <SelectItem value="Allied Health">Allied Health</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
              </SelectContent>
            </Select>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="rating-desc">Rating (High-Low)</SelectItem>
                <SelectItem value="rating-asc">Rating (Low-High)</SelectItem>
                <SelectItem value="established-asc">Established (Old-New)</SelectItem>
                <SelectItem value="established-desc">Established (New-Old)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* College Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {colleges.map((college) => (
            <Card key={college._id} onClick={() => handleViewDetails(college._id)} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48">
                <Image
                  src={college.imageUrl}
                  alt={college.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{college.rating}</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{college.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {college.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {college.students}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    {college.established}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {college.programs.slice(0, 3).map((program, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {program}
                      </Badge>
                    ))}
                    {college.programs.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{college.programs.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="pt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(college._id)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    {college.website && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={college.website} target="_blank">
                          <Globe className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading and Load More */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading colleges...</p>
          </div>
        )}

        {/* Infinite scroll trigger - only show if we have colleges and more to load */}
        {hasMore && !loading && colleges.length > 0 && (
          <div ref={observerTarget} className="h-10" />
        )}

        {/* No more results */}
        {!hasMore && colleges.length > 0 && (
          <div className="text-center py-8 text-gray-600">
            <p>You've seen all {totalCount} colleges</p>
          </div>
        )}

        {/* No results */}
        {!loading && colleges.length === 0 && totalCount === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600">
              {searchTerm || locationFilter !== 'all' || programFilter !== 'all'
                ? "Try adjusting your search or filters"
                : "No colleges are available at the moment"}
            </p>
            {(searchTerm || locationFilter !== 'all' || programFilter !== 'all') && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('all');
                  setProgramFilter('all');
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* College Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedCollege && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedCollege.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedCollege.location}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={selectedCollege.imageUrl}
                      alt={selectedCollege.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-center mb-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                      </div>
                      <div className="text-2xl font-bold">{selectedCollege.rating}</div>
                      <div className="text-sm text-gray-600">{selectedCollege.reviews}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-center mb-2">
                        <Users className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="text-lg font-semibold">{selectedCollege.students}</div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-center mb-2">
                        <GraduationCap className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="text-lg font-semibold">{ selectedCollege.established}</div>
                      <div className="text-sm text-gray-600">Established</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-center mb-2">
                        <BookOpen className="w-6 h-6 text-purple-500" />
                      </div>
                      <div className="text-lg font-semibold">{selectedCollege.programs.length}</div>
                      <div className="text-sm text-gray-600">Programs</div>
                    </div>
                  </div>

                  {selectedCollege.overview && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Overview</h3>
                      <p className="text-gray-700">{selectedCollege.overview}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Programs Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCollege.programs.map((program, index) => (
                        <Badge key={index} variant="secondary">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedCollege.affiliations && selectedCollege.affiliations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Affiliations</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollege.affiliations.map((affiliation, index) => (
                          <Badge key={index} variant="outline">
                            {affiliation}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCollege.website && (
                    <div className="pt-4">
                      <Button asChild>
                        <Link href={selectedCollege.website} target="_blank">
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}