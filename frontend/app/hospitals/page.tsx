"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  MapPin, 
  Star, 
  Search, 
  Users, 
  Bed, 
  Phone, 
  Clock,
  Award,
  Heart,
  Stethoscope,
  Activity,
  Building,
  Car,
  Filter,
  ChevronDown,
  ExternalLink,
  Mail,
  Shield,
  Truck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getHospitals, getHospitalSpecialties, getHospitalLocations, getHospitalById } from "@/lib/api";
import { Hospital, HospitalListResponse } from "@/types/hospitals";
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Sample fallback data for when API is not available
const SAMPLE_HOSPITALS = [
  {
    _id: 'sample-1',
    name: "Apollo Hospitals",
    imageUrl: "/placeholder.jpg",
    type: "Multi-specialty Healthcare",
    location: "Pan India",
    branches: 70,
    features: {
      beds: 10000,
      employees: 50000,
      doctors: 8000,
      staff: 42000,
      departments: 60,
      icuBeds: 2000,
      emergencyServices: true,
      ambulanceService: true,
      bloodBank: true,
      pharmacy: true,
      cafeteria: true,
      parkingSpaces: 5000
    },
    rating: 4.8,
    reviews: "2.1k reviews",
    specialties: ["Cardiology", "Oncology", "Transplants", "Neurology", "Orthopedics"]
  },
  {
    _id: 'sample-2',
    name: "Fortis Healthcare",
    imageUrl: "/placeholder.jpg",
    type: "Integrated Healthcare",
    location: "India",
    branches: 36,
    features: {
      beds: 4000,
      employees: 23000,
      doctors: 3500,
      staff: 19500,
      departments: 45,
      icuBeds: 800,
      emergencyServices: true,
      ambulanceService: true,
      bloodBank: true,
      pharmacy: true,
      cafeteria: true,
      parkingSpaces: 2500
    },
    rating: 4.7,
    reviews: "1.8k reviews",
    specialties: ["Neurology", "Orthopedics", "Emergency", "Cardiology", "Oncology"]
  },
  {
    _id: 'sample-3',
    name: "Max Healthcare",
    imageUrl: "/placeholder.jpg",
    type: "Super Specialty Care",
    location: "North India",
    branches: 17,
    features: {
      beds: 3500,
      employees: 15000,
      doctors: 2800,
      staff: 12200,
      departments: 40,
      icuBeds: 700,
      emergencyServices: true,
      ambulanceService: true,
      bloodBank: true,
      pharmacy: true,
      cafeteria: true,
      parkingSpaces: 2000
    },
    rating: 4.6,
    reviews: "1.5k reviews",
    specialties: ["Emergency", "Pediatrics", "Maternity", "Cardiology", "Orthopedics"]
  }
];

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const router = useRouter();

  // Fetch hospitals
  const fetchHospitals = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await getHospitals({
        page,
        limit: 12,
        search: searchTerm || undefined,
        location: selectedLocation === 'all' ? undefined : selectedLocation,
        specialty: selectedSpecialty === 'all' ? undefined : selectedSpecialty,
        sortBy,
        sortOrder
      });

      setApiAvailable(true);
      
      if (append) {
        setHospitals(prev => [...prev, ...response.hospitals]);
      } else {
        setHospitals(response.hospitals);
      }
      
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
      setHasNextPage(response.pagination.hasNextPage);
      setTotalCount(response.pagination.totalCount);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setApiAvailable(false);
      
      // Use fallback data if API is not available
      if (!append) {
        const filteredSampleData = SAMPLE_HOSPITALS.filter(hospital => {
          if (searchTerm && !hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
              !hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
              !hospital.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) {
            return false;
          }
          if (selectedLocation !== 'all' && !hospital.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
          if (selectedSpecialty !== 'all' && !hospital.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))) {
            return false;
          }
          return true;
        });
        
        setHospitals(filteredSampleData);
        setCurrentPage(1);
        setTotalPages(1);
        setHasNextPage(false);
        setTotalCount(filteredSampleData.length);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchTerm, selectedLocation, selectedSpecialty, sortBy, sortOrder]);

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const [specialtiesResponse, locationsResponse] = await Promise.all([
        getHospitalSpecialties(),
        getHospitalLocations()
      ]);
      setSpecialties(specialtiesResponse);
      setLocations(locationsResponse);
    } catch (error) {
      console.error('Error fetching filter options:', error);
      // Set fallback data from sample hospitals
      const fallbackSpecialties = Array.from(new Set(SAMPLE_HOSPITALS.flatMap(h => h.specialties))).sort();
      const fallbackLocations = Array.from(new Set(SAMPLE_HOSPITALS.map(h => h.location))).sort();
      setSpecialties(fallbackSpecialties);
      setLocations(fallbackLocations);
    }
  };

  // Load more hospitals (infinite scroll)
  const loadMore = () => {
    if (hasNextPage && !loadingMore) {
      fetchHospitals(currentPage + 1, true);
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchHospitals(1, false);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchHospitals(1, false);
  };

  // View hospital details
  const viewHospitalDetails = async (hospitalId: string) => {
    try {
      // Check if it's a sample ID
      if (hospitalId.startsWith('sample-')) {
        const sampleHospital = SAMPLE_HOSPITALS.find(h => h._id === hospitalId);
        if (sampleHospital) {
          setSelectedHospital({
            ...sampleHospital,
            details: {
              established: "1983",
              founders: ["Healthcare Pioneers"],
              vision: "To provide world-class healthcare services",
              mission: "Delivering excellence in patient care",
              accreditations: ["JCI", "NABH"],
              awards: ["Best Healthcare Provider"],
              website: "https://example.com",
              emergencyNumber: "108",
              generalNumber: "+91-11-12345678",
              email: "info@hospital.com",
              address: "Medical District",
              city: "Healthcare City",
              state: "Sample State",
              pincode: "123456",
              operatingHours: "24/7",
              emergencyHours: "24/7",
              facilities: ["Emergency Care", "ICU", "Blood Bank", "Pharmacy"],
              departments: sampleHospital.specialties,
              medicalEquipment: ["MRI", "CT Scan", "X-Ray"],
              insuranceAccepted: ["Mediclaim", "Cashless"]
            }
          });
          setShowDetailsModal(true);
          return;
        }
      }

      const hospital = await getHospitalById(hospitalId);
      setSelectedHospital(hospital);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching hospital details:', error);
      // Show a simple alert or toast notification
      alert('Unable to load hospital details. Please try again later.');
    }
  };

  // Initial load
  useEffect(() => {
    fetchFilterOptions();
    fetchHospitals();
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (currentPage === 1) {
      const timeoutId = setTimeout(() => {
        fetchHospitals(1, false);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, selectedLocation, selectedSpecialty, sortBy, sortOrder]);

  // Infinite scroll implementation
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, loadingMore]);

  const renderHospitalCard = (hospital: Hospital) => (
    <Card 
      key={hospital._id} 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
      onClick={() => viewHospitalDetails(hospital._id)}
    >
      <CardHeader>
        <Image
          src={hospital.imageUrl}
          alt={hospital.name}
          width={300}
          height={120}
          className="w-full h-24 object-cover rounded-lg mb-4 group-hover:brightness-105 transition-all duration-300"
        />
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-blue-900 group-hover:text-blue-700 transition-colors duration-300">{hospital.name}</CardTitle>
            <CardDescription className="group-hover:text-gray-700 transition-colors duration-300">{hospital.type}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{hospital.location}{hospital.branches && hospital.branches > 0 ? ` • ${hospital.branches}+ locations` : ''}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Bed className="w-4 h-4 mr-2" />
          <span>{hospital.features.beds.toLocaleString()}+ beds</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Users className="w-4 h-4 mr-2" />
          <span>{hospital.features.employees.toLocaleString()}+ employees</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <Stethoscope className="w-4 h-4 mr-2" />
          <span>{hospital.features.doctors.toLocaleString()}+ doctors</span>
        </div>
        <div className="flex items-center mb-4">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 ml-1">{hospital.rating} ({hospital.reviews})</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {hospital.specialties.slice(0, 3).map((specialty) => (
            <Badge 
              key={specialty} 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 text-xs group-hover:bg-blue-200 transition-colors duration-300"
            >
              {specialty}
            </Badge>
          ))}
          {hospital.specialties.length > 3 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs group-hover:bg-gray-200 transition-colors duration-300">
              +{hospital.specialties.length - 3} more
            </Badge>
          )}
        </div>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is clicked
            viewHospitalDetails(hospital._id);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  const renderHospitalDetails = () => {
    if (!selectedHospital) return null;

    return (
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <Image
              src={selectedHospital.imageUrl}
              alt={selectedHospital.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold text-blue-900 mb-2">{selectedHospital.name}</h3>
            <p className="text-gray-600 mb-4">{selectedHospital.type}</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Bed className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Beds</p>
                <p className="font-semibold">{selectedHospital.features.beds.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Stethoscope className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Doctors</p>
                <p className="font-semibold">{selectedHospital.features.doctors.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Building className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Departments</p>
                <p className="font-semibold">{selectedHospital.features.departments}</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold">{selectedHospital.rating}/5</p>
              </div>
            </div>
          </div>

          {/* Establishment & Vision */}
          {selectedHospital.details && (
            <div className="space-y-4">
              {selectedHospital.details.established && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Established</h4>
                  <p className="text-gray-600">{selectedHospital.details.established}</p>
                </div>
              )}
              
              {selectedHospital.details.founders && selectedHospital.details.founders.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Founders</h4>
                  <p className="text-gray-600">{selectedHospital.details.founders.join(', ')}</p>
                </div>
              )}

              {selectedHospital.details.vision && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Vision</h4>
                  <p className="text-gray-600">{selectedHospital.details.vision}</p>
                </div>
              )}

              {selectedHospital.details.mission && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mission</h4>
                  <p className="text-gray-600">{selectedHospital.details.mission}</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Information */}
          {selectedHospital.details && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-2">
                {selectedHospital.details.emergencyNumber && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm text-gray-600">Emergency: {selectedHospital.details.emergencyNumber}</span>
                  </div>
                )}
                {selectedHospital.details.generalNumber && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">General: {selectedHospital.details.generalNumber}</span>
                  </div>
                )}
                {selectedHospital.details.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">{selectedHospital.details.email}</span>
                  </div>
                )}
                {selectedHospital.details.website && (
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 text-purple-600 mr-2" />
                    <a 
                      href={selectedHospital.details.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Specialties */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {selectedHospital.specialties.map((specialty) => (
                <Badge 
                  key={specialty} 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-700"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Features & Facilities */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Features & Facilities</h4>
            <div className="grid grid-cols-2 gap-2">
              {selectedHospital.features.emergencyServices && (
                <div className="flex items-center">
                  <Heart className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-gray-600">Emergency Services</span>
                </div>
              )}
              {selectedHospital.features.ambulanceService && (
                <div className="flex items-center">
                  <Truck className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Ambulance Service</span>
                </div>
              )}
              {selectedHospital.features.bloodBank && (
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-gray-600">Blood Bank</span>
                </div>
              )}
              {selectedHospital.features.pharmacy && (
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Pharmacy</span>
                </div>
              )}
              {selectedHospital.features.cafeteria && (
                <div className="flex items-center">
                  <Building className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-600">Cafeteria</span>
                </div>
              )}
              {selectedHospital.features.parkingSpaces && (
                <div className="flex items-center">
                  <Car className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">Parking Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Accreditations */}
          {selectedHospital.details?.accreditations && selectedHospital.details.accreditations.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Accreditations</h4>
              <div className="flex flex-wrap gap-2">
                {selectedHospital.details.accreditations.map((accreditation) => (
                  <Badge 
                    key={accreditation} 
                    variant="secondary" 
                    className="bg-green-100 text-green-700"
                  >
                    {accreditation}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Operating Hours */}
          {selectedHospital.details?.operatingHours && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Operating Hours</h4>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-gray-600">{selectedHospital.details.operatingHours}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Hospital Networks</h1>
          <p className="text-gray-600">Connect with leading healthcare institutions worldwide</p>
          <p className="text-sm text-gray-500 mt-1">
            Showing {hospitals.length} of {totalCount} hospitals
            {!apiAvailable && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Demo data - API not available
              </span>
            )}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search hospitals..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Specialty Filter */}
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [newSortBy, newSortOrder] = value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder as 'asc' | 'desc');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
                <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
                <SelectItem value="name-asc">Name (A to Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z to A)</SelectItem>
                <SelectItem value="features.beds-desc">Beds (High to Low)</SelectItem>
                <SelectItem value="features.beds-asc">Beds (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hospital Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="w-full h-24 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-3 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {totalCount === 0 && (searchTerm || selectedLocation !== 'all' || selectedSpecialty !== 'all') 
                ? "No hospitals found" 
                : "Hospital data not available"}
            </h3>
            <p className="text-gray-600">
              {totalCount === 0 && (searchTerm || selectedLocation !== 'all' || selectedSpecialty !== 'all')
                ? "Try adjusting your search criteria or filters."
                : "Hospital information will be loaded once the service is available."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map(renderHospitalCard)}
            </div>

            {/* Load More */}
            {loadingMore && (
              <div className="mt-8 text-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardHeader>
                        <div className="w-full h-24 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-3 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* End of results */}
            {!hasNextPage && hospitals.length > 0 && (
              <div className="mt-8 text-center text-gray-500">
                <p>You've reached the end of the results</p>
              </div>
            )}
          </>
        )}

        {/* Hospital Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Hospital Details</DialogTitle>
              <DialogDescription>
                Complete information about the hospital
              </DialogDescription>
            </DialogHeader>
            {renderHospitalDetails()}
          </DialogContent>
        </Dialog>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
