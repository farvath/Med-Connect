import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitution extends Document {
  name: string;
}

const InstitutionSchema = new Schema<IInstitution>({
  name: { type: String, required: true, unique: true },
}, { versionKey: false, collection: 'institutions' });

export default mongoose.models.Institution || mongoose.model<IInstitution>('Institution', InstitutionSchema);
