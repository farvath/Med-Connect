import { Schema, Document, model, Types } from 'mongoose';

export interface IMedia {
  type: 'image' | 'video';
  url: string;
  fileId: string;
  fileName: string;
  size: number;
}

export interface IPost extends Document {
  userId: Types.ObjectId;
  description: string;
  media: IMedia[];
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>({
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
  fileId: { type: String, required: true },
  fileName: { type: String, required: true },
  size: { type: Number, required: true }
});

const PostSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  media: [MediaSchema],
}, { versionKey: false, timestamps: true });

export default model<IPost>('Post', PostSchema);
