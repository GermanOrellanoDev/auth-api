import { Schema, model, Types, Document } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  user: Types.ObjectId;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);
