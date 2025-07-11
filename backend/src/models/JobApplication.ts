import { Schema, Document, model } from 'mongoose';

export interface IJobApplication extends Document {
  jobId: Schema.Types.ObjectId;
  applicantId: Schema.Types.ObjectId;
  appliedDate: Date;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

const JobApplicationSchema = new Schema<IJobApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  appliedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { versionKey: false, timestamps: true });

// Ensure unique application per user per job
JobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

export default model<IJobApplication>('JobApplication', JobApplicationSchema);
