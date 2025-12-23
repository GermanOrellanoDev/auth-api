import { Request, Response, NextFunction } from "express";

export const authorize =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Insufficient permisions" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
