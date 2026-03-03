// backend/src/services/job.service.js

import { prisma } from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";

/* =========================
   CREATE JOB
========================= */

const createJob = async (userId, data) => {
  const job = await prisma.job.create({
    data: {
      ...data,

      user: {
        connect: { id: userId },
      },

      applicationDate: data.applicationDate
        ? new Date(data.applicationDate)
        : new Date(),

      interviewDate: data.interviewDate
        ? new Date(data.interviewDate)
        : undefined,
    },
  });

  return job;
};

/* =========================
   GET JOBS (FILTER + PAGINATION)
========================= */

const getJobs = async (userId, query) => {
  const {
    search,
    status,
    priority,
    page = 1,
    limit = 10,
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const where = {
    userId,
    isDeleted: false,
  };

  if (status) where.status = status;
  if (priority) where.priority = priority;

  if (search) {
    where.OR = [
      {
        companyName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        roleTitle: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limitNumber,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

/* =========================
   UPDATE JOB
========================= */

const updateJob = async (userId, jobId, data) => {
  const existingJob = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
      isDeleted: false,
    },
  });

  if (!existingJob) {
    throw new ApiError(404, "Job not found");
  }

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: {
      ...data,
      applicationDate: data.applicationDate
        ? new Date(data.applicationDate)
        : undefined,
      interviewDate: data.interviewDate
        ? new Date(data.interviewDate)
        : undefined,
    },
  });

  return updatedJob;
};

/* =========================
   DELETE JOB (SOFT DELETE)
========================= */

const deleteJob = async (userId, jobId) => {
  const existingJob = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
      isDeleted: false,
    },
  });

  if (!existingJob) {
    throw new ApiError(404, "Job not found");
  }

  const deletedJob = await prisma.job.update({
    where: { id: jobId },
    data: {
      isDeleted: true,
    },
  });

  return deletedJob;
};

export default {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};