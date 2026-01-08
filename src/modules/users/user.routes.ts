import { Router } from "express";
import { listUsers, getUser, updateUser, deleteUser } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();
const { body, param, query, validationResult } = require("express-validator");

const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  console.log("👉 REQUEST A /users");
  next();
};

router.use(authenticate, authorize(["ADMIN"]));

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("search").optional().isString(),
    query("role").optional().isIn(["ADMIN", "USER"]),
    query("isActive").optional().isBoolean().toBoolean(),
  ],
  validate,
  listUsers
);

router.get("/:id", [param("id").isMongoId()], validate, getUser);

router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("name").optional().isString().isLength({ min: 2 }),
    body("email").optional().isEmail(),
    body("role").optional().isIn(["ADMIN", "USER"]),
    body("isActive").optional().isBoolean(),
    body("password").optional().isLength({ min: 6 }),
  ],
  validate,
  updateUser
);

router.delete("/:id", [param("id").isMongoId()], validate, deleteUser);

export default router;
