import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createJob,
  getJobs,
  updateJob,
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

export default router;