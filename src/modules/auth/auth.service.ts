import { User } from "../users/user.model";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import { createRefreshToken } from "./refresh.service";
import { expiresInToDate } from "../../utils/time";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  const expiresEnv = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  const expiresAt = expiresInToDate(expiresEnv);
  await createRefreshToken(user._id.toString(), refreshToken, expiresAt);

  return { user, token, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isActive) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  const expiresEnv = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  const expiresAt = expiresInToDate(expiresEnv);
  await createRefreshToken(user._id.toString(), refreshToken, expiresAt);

  return { user, token, refreshToken };
};
