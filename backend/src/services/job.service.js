import { prisma } from "../config/prisma.js";

const createJob = async (userId, data) => {
  const job = await prisma.job.create({
    data: {
      ...data,

      // relation connect
      user: {
        connect: {
          id: userId,
        },
      },

      // REQUIRED FIELD → fallback to today
      applicationDate: data.applicationDate
        ? new Date(data.applicationDate)
        : new Date(),

      // optional
      interviewDate: data.interviewDate
        ? new Date(data.interviewDate)
        : undefined,
    },
  });

  return job;
};

export default {
  createJob,
};