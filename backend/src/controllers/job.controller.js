// backend/src/controllers/job.controller.js

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jobService from "../services/job.service.js";
import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/prisma.js";
import emailService from "../services/email.service.js";

/* =========================
   CREATE JOB
========================= */

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(
    req.user.id,
    req.validated
  );

  return res.status(201).json(
    new ApiResponse(201, job, "Job created successfully")
  );
});

/* =========================
   GET JOBS
========================= */

export const getJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getJobs(
    req.user.id,
    req.query
  );

  return res.status(200).json(
    new ApiResponse(200, result, "Jobs fetched successfully")
  );
});

/* =========================
   UPDATE JOB
========================= */

export const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(
    req.user.id,
    req.params.id,
    req.validated
  );

  return res.status(200).json(
    new ApiResponse(200, job, "Job updated successfully")
  );
});

/* =========================
   DELETE JOB
========================= */

export const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.user.id, req.params.id);

  return res.status(200).json(
    new ApiResponse(200, null, "Job deleted successfully")
  );
});

/* =========================
   UPLOAD RESUME (FIXED)
========================= */

export const uploadResume = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const existingJob = await prisma.job.findFirst({
    where: { id: req.params.id, userId: req.user.id, isDeleted: false },
  });

  if (!existingJob) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "resumes" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });

  const updatedJob = await prisma.job.update({
    where: { id: req.params.id },
    data: { resumeUrl: uploadResult.secure_url },
  });

  return res.status(200).json(
    new ApiResponse(200, updatedJob, "Resume uploaded successfully")
  );
});

export const sendInterviewReminder = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.user.id, req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  if (!job.interviewDate) {
    return res.status(400).json({
      success: false,
      message: "This job has no interview date",
    });
  }

  await emailService.sendInterviewReminder(req.user, job);

  return res.status(200).json(
    new ApiResponse(200, null, "Interview reminder sent successfully")
  );
});