import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jobService from "../services/job.service.js";

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(
    req.user.id,
    req.validated
  );

  return res.status(201).json(
    new ApiResponse(201, job, "Job created successfully")
  );
});