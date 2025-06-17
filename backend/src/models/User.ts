import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  specialty: string;
  institution: string;
  location: string;
  accountType: string;
  profilePic?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, required: true },
  accountType: { type: String, required: true },
  profilePic: { type: String },
}, { versionKey: false });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
