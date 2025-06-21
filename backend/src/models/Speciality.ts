import mongoose, { Schema, Document } from 'mongoose';

export interface ISpeciality extends Document {
  name: string;
}

const SpecialitySchema = new Schema<ISpeciality>({
  name: { type: String, required: true, unique: true },
}, { versionKey: false, collection: 'specialties' });

export default mongoose.models.Speciality || mongoose.model<ISpeciality>('Speciality', SpecialitySchema);
