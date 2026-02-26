import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createJob,
  getJobs,
} from "../controllers/job.controller.js";

import { createJobSchema } from "../validators/job.validator.js";

const router = express.Router();

router.get("/", authMiddleware, getJobs);

router.post(
  "/",
  authMiddleware,
  validate(createJobSchema),
  createJob
);

export default router;