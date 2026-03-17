// backend/src/routes/job.routes.js

import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";

import {
  createJobSchema,
  updateJobSchema,
} from "../validators/job.validator.js";

const router = express.Router();

router.get("/", authMiddleware, getJobs);

router.post(
  "/",
  authMiddleware,
  validate(createJobSchema),
  createJob
);

router.patch(
  "/:id",
  authMiddleware,
  validate(updateJobSchema),
  updateJob
);

router.delete("/:id", authMiddleware, deleteJob);

import upload from "../middleware/upload.middleware.js";
import { uploadResume } from "../controllers/job.controller.js";

router.post(
  "/:id/upload",
  upload.single("file"),
  uploadResume
);

export default router;