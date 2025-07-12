import { Schema, Document, model } from 'mongoose';

export interface IJob extends Document {
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
    id: string; // Reference to hospital/institution
  };
  postedBy: Schema.Types.ObjectId; // User ID who posted the job
  postedDate: Date;
  isActive: boolean;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String, required: true }],
  responsibilities: [{ type: String, required: true }],
  benefits: [{ type: String }],
  salary: { type: String, required: true },
  location: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true 
  },
  experience: { type: String, required: true },
  aboutInstitution: { type: String, required: true },
  institution: {
    name: { type: String, required: true },
    id: { type: String, required: true }
  },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { versionKey: false, timestamps: true });

export default model<IJob>('Job', JobSchema);
