import { Schema, Document, model, Types } from 'mongoose';

export interface ILike extends Document {
  userId: Types.ObjectId;
  entityId: Types.ObjectId;
  entityType: 'post' | 'comment';
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  entityType: { type: String, enum: ['post', 'comment'], required: true },
}, { versionKey: false, timestamps: true });

// Compound index to ensure a user can only like an entity once
LikeSchema.index({ userId: 1, entityId: 1, entityType: 1 }, { unique: true });

export default model<ILike>('Like', LikeSchema);
