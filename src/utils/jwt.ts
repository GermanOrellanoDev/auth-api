import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sercret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "24h", //corregir
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" }); //corregir
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
