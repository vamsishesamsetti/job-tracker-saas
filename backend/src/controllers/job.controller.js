import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jobService from "../services/job.service.js";

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user.id, req.validated);

  return res.status(201).json(
    new ApiResponse(201, job, "Job created successfully")
  );
});

export const getJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getJobs(req.user.id, req.query);

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