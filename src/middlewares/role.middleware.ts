import { Request, Response, NextFunction } from "express";

export const authorize =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("🛂 authorize start");
    console.log("User:", req.user);
    console.log("Allowed:", allowedRoles);
    try {
      if (!req.user) {
        console.log("❌ no user in req");
        return res.status(401).json({ error: "Not authenticated" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        console.log("❌ role rejected");
        return res.status(403).json({ error: "Insufficient permisions" });
      }
      console.log("✅ authorize OK");
      next();
    } catch (error) {
      next(error);
    }
  };
