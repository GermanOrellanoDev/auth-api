import { RefreshToken } from "./refreshToken.model";
import { Types } from "mongoose";

export const createRefreshToken = async (
  userId: string,
  token: string,
  expiresAt: Date
) => {
  const rt = await RefreshToken.create({
    token,
    user: new Types.ObjectId(userId),
    expiresAt,
  });
  return rt;
};

export const findRefreshToken = async (token: string) => {
  return RefreshToken.findOne({ token });
};

export const revokeRefreshToken = async (token: string) => {
  return RefreshToken.findOneAndUpdate(
    { token },
    { revoked: true },
    { new: true }
  );
};

export const revokeAllRefreshTokensForUser = async (userId: string) => {
  return RefreshToken.updateMany({ user: userId }, { revoked: true });
};
