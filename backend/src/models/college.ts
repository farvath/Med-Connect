import mongoose, { Document, Schema } from 'mongoose';

export interface College {
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
}

export interface CollegeDocument extends College, Document {}

const collegeSchema = new Schema<CollegeDocument>({
  name: { type: String, required: true, index: true },
  shortName: { type: String, required: true },
  location: { type: String, required: true, index: true },
  students: { type: String, required: true },
  established: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviews: { type: String, required: true },
  programs: [{ type: String, required: true }],
  imageUrl: { type: String, required: true },
  overview: { type: String },
  website: { type: String },
  affiliations: [{ type: String }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for better query performance
// Note: name and location indexes are already created via field definitions
collegeSchema.index({ programs: 1 });
collegeSchema.index({ rating: -1 });

export const CollegeModel = mongoose.model<CollegeDocument>('colleges', collegeSchema);