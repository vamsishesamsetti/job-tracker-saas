// backend/src/controllers/job.controller.js

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jobService from "../services/job.service.js";
import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/prisma.js";

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
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  // ✅ SAFE PROMISE WRAPPER
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });

  const updatedJob = await prisma.job.update({
    where: { id: req.params.id },
    data: {
      resumeUrl: uploadResult.secure_url,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, updatedJob, "Resume uploaded successfully")
  );

});