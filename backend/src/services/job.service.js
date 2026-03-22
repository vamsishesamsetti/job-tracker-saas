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
   GET JOBS (FILTER + PAGINATION + SORT)
========================= */

const getJobs = async (userId, query) => {
  const {
    search = "",
    status,
    priority,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 50); // max 50

  const skip = (pageNumber - 1) * limitNumber;

  const where = {
    userId,
    isDeleted: false,

    ...(status && { status }),
    ...(priority && { priority }),

    ...(search && {
      OR: [
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
      ],
    }),
  };

  const orderBy = {
    [sortBy]: order === "asc" ? "asc" : "desc",
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip,
      take: limitNumber,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

/* =========================
   GET JOB BY ID
========================= */

const getJobById = async (userId, jobId) => {
  return prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
      isDeleted: false,
    },
  });
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
  getJobById,
};