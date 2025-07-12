// Hospital interface
export interface Hospital {
  _id: string;
  name: string;
  imageUrl: string;
  type: string;
  location: string;
  branches?: number;
  features: {
    beds: number;
    employees: number;
    doctors: number;
    staff: number;
    departments: number;
    icuBeds?: number;
    emergencyServices: boolean;
    ambulanceService: boolean;
    bloodBank: boolean;
    pharmacy: boolean;
    cafeteria: boolean;
    parkingSpaces?: number;
  };
  rating: number;
  reviews: string;
  specialties: string[];
  details?: {
    established: string;
    founders?: string[];
    vision?: string;
    mission?: string;
    accreditations?: string[];
    awards?: string[];
    website?: string;
    emergencyNumber?: string;
    generalNumber?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    operatingHours?: string;
    emergencyHours?: string;
    facilities?: string[];
    departments?: string[];
    medicalEquipment?: string[];
    insuranceAccepted?: string[];
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

// Pagination interface
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Filters interface
export interface HospitalFilters {
  search: string | null;
  location: string | null;
  specialty: string | null;
}

// Sort interface
export interface HospitalSort {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// API response interface
export interface HospitalListResponse {
  success: boolean;
  data: {
    hospitals: Hospital[];
    pagination: Pagination;
    filters: HospitalFilters;
    sort: HospitalSort;
  };
}

// Single hospital response interface
export interface HospitalResponse {
  success: boolean;
  data: Hospital;
}

// Hospital specialties response
export interface HospitalSpecialtiesResponse {
  success: boolean;
  data: string[];
}

// Hospital locations response
export interface HospitalLocationsResponse {
  success: boolean;
  data: string[];
}
