import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { User } from "../users/user.model";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from "./refresh.service";
import { expiresInToDate } from "../../utils/time";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await registerUser(name, email, password);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await loginUser(email, password);
    const expiresEnv = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    const expiresAt = expiresInToDate(expiresEnv);

    res.cookie(
      process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken",
      refreshToken,
      {
        httpOnly: process.env.REFRESH_TOKEN_COOKIE_HTTPONLY !== "false",
        secure: process.env.REFRESH_TOKEN_COOKIE_SECURE === "true",
        sameSite: (process.env.REFRESH_TOKEN_COOKIE_SAMESITE as any) || "lax",
        expires: expiresAt,
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  console.log("🔁 REFRESH HIT");
  try {
    const tokenFromCookie =
      req.cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME || "refresk_token"];
    const token = tokenFromCookie || req.body.refreshToken;
    if (!token) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    let payload;

    try {
      payload = verifyRefreshToken(token);
    } catch (error) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const rtDoc = await findRefreshToken(token);
    if (!rtDoc || rtDoc.revoked)
      return res
        .status(401)
        .json({ error: "Refresh token revoked or not found" });

    await revokeRefreshToken(token);

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive)
      return res.status(401).json({ error: "User invalid" });

    const newAccessToken = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const expiresEnv = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    const expiresAt = expiresInToDate(expiresEnv);
    await createRefreshToken(user._id.toString(), newRefreshToken, expiresAt);

    const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";
    const cookieSecure = process.env.REFRESH_TOKEN_COOKIE_SECURE === "true";
    const cookieHttpOnly =
      process.env.REFRESH_TOKEN_COOKIE_HTTPONLY !== "false";
    const cookieSameSite =
      (process.env.REFRESH_TOKEN_COOKIE_SAMESITE as any) || "lax";

    res.cookie(cookieName, newRefreshToken, {
      httpOnly: cookieHttpOnly,
      secure: cookieSecure,
      sameSite: cookieSameSite,
      expires: expiresAt,
      path: "/",
    });

    return res.json({
      token: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const tokenFromCookie =
      req.cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken"];
    const token = tokenFromCookie || req.body.refreshToken;
    if (!token) {
      res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken", {
        path: "/",
      });
      return res.json({ message: "Logged out" });
    }

    await revokeRefreshToken(token);

    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken", {
      path: "/",
    });
    return res.json({ message: "Logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
