import express from "express";

import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  uploadResume,
  sendInterviewReminder,
} from "../controllers/job.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  createJobSchema,
  updateJobSchema,
} from "../validators/job.validator.js";

const router = express.Router();

/* =========================
   PROTECTED ROUTES
========================= */

router.use(authMiddleware);

/* =========================
   JOB CRUD
========================= */

router.post("/", validate(createJobSchema), createJob);

router.get("/", getJobs);

router.patch("/:id", validate(updateJobSchema), updateJob);

router.delete("/:id", deleteJob);

/* =========================
   UPLOAD RESUME
========================= */

router.post(
  "/:id/upload",
  upload.single("file"),
  uploadResume
);

/* =========================
   SEND EMAIL REMINDER
========================= */

router.post("/:id/send-reminder", sendInterviewReminder);

export default router;