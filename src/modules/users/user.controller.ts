import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("📦 controller listUsers START");
  try {
    const result = userService.listUsers(req.query);
    console.log("📦 controller listUsers END");
    res.json(result);
  } catch (error) {
    console.error("🔥 controller error", error);
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "User id is required" });
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "User id is required" });
    const updated = await userService.updateUserById(id, payload);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated", user: updated });
  } catch (error: any) {
    if (error.code === 11000)
      return res.status(400).json({ error: "Email already in use" });
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "User id is required" });
    const deleted = userService.softDeleteUserById(id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User disable (soft deleted)", user: deleted });
  } catch (error) {
    next(error);
  }
};
