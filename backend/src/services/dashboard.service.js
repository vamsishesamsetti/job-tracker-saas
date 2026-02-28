import { prisma } from "../config/prisma.js";

const getDashboardStats = async (userId) => {
  const totalApplications = await prisma.job.count({
    where: {
      userId,
      isDeleted: false,
    },
  });

  const interviews = await prisma.job.count({
    where: {
      userId,
      status: "INTERVIEW",
      isDeleted: false,
    },
  });

  const offers = await prisma.job.count({
    where: {
      userId,
      status: "OFFER",
      isDeleted: false,
    },
  });

  const rejections = await prisma.job.count({
    where: {
      userId,
      status: "REJECTED",
      isDeleted: false,
    },
  });

  const statusBreakdown = await prisma.job.groupBy({
    by: ["status"],
    where: {
      userId,
      isDeleted: false,
    },
    _count: {
      status: true,
    },
  });

  return {
    totalApplications,
    interviews,
    offers,
    rejections,
    statusBreakdown,
  };
};

export default {
  getDashboardStats,
};