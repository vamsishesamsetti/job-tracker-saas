import asyncHandler from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";

/* =========================
   DASHBOARD SUMMARY
========================= */

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [total, interviews, offers, rejections, recentJobs] =
    await Promise.all([

      prisma.job.count({
        where: { userId, isDeleted: false },
      }),

      prisma.job.count({
        where: {
          userId,
          status: "INTERVIEW",
          isDeleted: false,
        },
      }),

      prisma.job.count({
        where: {
          userId,
          status: "OFFER",
          isDeleted: false,
        },
      }),

      prisma.job.count({
        where: {
          userId,
          status: "REJECTED",
          isDeleted: false,
        },
      }),

      prisma.job.findMany({
        where: { userId, isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

    ]);

  return res.status(200).json({
    success: true,
    data: {
      totalApplications: total,
      interviews,
      offers,
      rejections,
      recentJobs,
    },
  });
});