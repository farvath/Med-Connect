// Define College interface
export interface College {
  _id: string;
  name: string;
  shortName: string;
  location: string;
  students: string;
  established: string;
  rating: number;
  reviews: string;
  programs: string[];
  imageUrl: string;
  overview?: string;
  website?: string;
  affiliations?: string[];
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
export interface CollegeFilters {
  search: string | null;
  location: string | null;
  programs: string[] | null;
}

// Sort interface
export interface CollegeSort {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// API response interface
export interface CollegeListResponse {
  success: boolean;
  data: {
    colleges: College[];
    pagination: Pagination;
    filters: CollegeFilters;
    sort: CollegeSort;
  };
  message: string;
}

// Query parameters for API calls
export interface CollegeQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  location?: string;
  programs?: string;
}