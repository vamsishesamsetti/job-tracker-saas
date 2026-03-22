import express from "express";
import { updatePassword } from "../controllers/auth.controller.js";

import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);

/* =========================
   PROFILE ROUTES
========================= */

router.get("/me", authMiddleware, getMe);

router.patch("/update-profile", authMiddleware, updateProfile);
router.patch("/update-password", authMiddleware, updatePassword);

export default router;