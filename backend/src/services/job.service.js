import { prisma } from "../config/prisma.js";

/* =========================
   CREATE JOB
========================= */

const createJob = async (userId, data) => {
  const job = await prisma.job.create({
    data: {
      ...data,

      user: {
        connect: {
          id: userId,
        },
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
   GET JOBS (FILTERED)
========================= */

const getJobs = async (userId, query) => {
  const { search, status, priority } = query;

  const where = {
    userId,
    isDeleted: false,
  };

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

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

  const jobs = await prisma.job.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs;
};

export default {
  createJob,
  getJobs,
};