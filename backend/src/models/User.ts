import { Schema, Document, model } from 'mongoose';

// Define interfaces for nested objects (Education and Experience)
export interface IEducation {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date; // Optional: for current education
  description?: string;
}

export interface IExperience {
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date; // Optional: for current job
  description?: string;
  current: boolean; // To indicate current position
}

// Update the main IUser interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  specialty: string;
  institution: string; // Keeping for initial signup data, can be deprecated later if education array takes over
  location: string;
  accountType: string;
  profilePic?: { // Modified: To store ImageKit URL and fileId
    url: string;
    fileId: string;
  };
  headline?: string; // New: For the short professional headline
  bio?: string;      // New: For a longer "About" section
  education: IEducation[]; // New: Array of education entries
  experience: IExperience[]; // New: Array of experience entries
}

// Define the Mongoose Schema
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, required: true },
  accountType: { type: String, required: true },
  profilePic: {
    url: { type: String },
    fileId: { type: String }, // Store fileId for deletion
  },
  headline: { type: String },
  bio: { type: String },
  education: [ // Array of education sub-documents
    {
      degree: { type: String, required: true },
      institution: { type: String, required: true },
      fieldOfStudy: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      description: { type: String },
    },
  ],
  experience: [ // Array of experience sub-documents
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      description: { type: String },
      current: { type: Boolean, default: false }, // Indicates if this is the current job
    },
  ],
}, { versionKey: false, timestamps: true }); // Added timestamps for createdAt/updatedAt

// Export the User model
export default model<IUser>('User', UserSchema);
