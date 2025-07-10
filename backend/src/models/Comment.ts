import { Schema, Document, model, Types } from 'mongoose';

export interface IComment extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
}, { versionKey: false, timestamps: true });

export default model<IComment>('Comment', CommentSchema);
