import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true, unique: true },
}, { versionKey: false, collection: 'cities' });

export default mongoose.models.City || mongoose.model<ICity>('City', CitySchema);
