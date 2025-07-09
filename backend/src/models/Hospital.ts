import mongoose, { Document, Schema } from 'mongoose';

export interface Hospital {
  name: string;
  imageUrl: string;
  type: string; // e.g., "Multi-specialty", "Super Specialty", "Specialty Care", etc.
  location: string;
  branches?: number; // Number of branches, optional
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
  reviews: string; // e.g., "2.1k reviews"
  specialties: string[]; // Array of specialties like "Cardiology", "Oncology", etc.
  
  // Additional details for hospital page
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
}

export interface HospitalDocument extends Hospital, Document {}

const hospitalSchema = new Schema<HospitalDocument>({
  name: { type: String, required: true, index: true },
  imageUrl: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true, index: true },
  branches: { type: Number, default: 0 },
  features: {
    beds: { type: Number, required: true },
    employees: { type: Number, required: true },
    doctors: { type: Number, required: true },
    staff: { type: Number, required: true },
    departments: { type: Number, required: true },
    icuBeds: { type: Number },
    emergencyServices: { type: Boolean, default: true },
    ambulanceService: { type: Boolean, default: true },
    bloodBank: { type: Boolean, default: false },
    pharmacy: { type: Boolean, default: true },
    cafeteria: { type: Boolean, default: true },
    parkingSpaces: { type: Number }
  },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviews: { type: String, required: true },
  specialties: [{ type: String, required: true, index: true }],
  
  details: {
    established: { type: String },
    founders: [{ type: String }],
    vision: { type: String },
    mission: { type: String },
    accreditations: [{ type: String }],
    awards: [{ type: String }],
    website: { type: String },
    emergencyNumber: { type: String },
    generalNumber: { type: String },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    operatingHours: { type: String },
    emergencyHours: { type: String },
    facilities: [{ type: String }],
    departments: [{ type: String }],
    medicalEquipment: [{ type: String }],
    insuranceAccepted: [{ type: String }],
    socialMedia: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for better query performance
hospitalSchema.index({ name: 'text', location: 'text', specialties: 'text' });
hospitalSchema.index({ rating: -1 });
hospitalSchema.index({ 'features.beds': -1 });
hospitalSchema.index({ type: 1 });

export const HospitalModel = mongoose.model<HospitalDocument>('hospitals', hospitalSchema);
