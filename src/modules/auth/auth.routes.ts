import { Router } from "express";
import { login, register, profile, refresh, logout } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, profile);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
