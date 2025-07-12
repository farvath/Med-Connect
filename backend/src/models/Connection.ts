import { Schema, Document, model } from 'mongoose';

export interface IConnection extends Document {
  followerId: Schema.Types.ObjectId; // The user who sent the connection request
  followingId: Schema.Types.ObjectId; // The user who received the connection request
  isAccepted: boolean; // Whether the connection request has been accepted
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>({
  followerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  followingId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isAccepted: { 
    type: Boolean, 
    default: false 
  },
}, { 
  versionKey: false, 
  timestamps: true 
});

// Create compound index to ensure unique connections between users
ConnectionSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export default model<IConnection>('Connection', ConnectionSchema);
