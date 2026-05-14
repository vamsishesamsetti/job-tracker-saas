import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import dashboardService from "../services/dashboard.service.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(
    req.user.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      stats,
      "Dashboard stats fetched successfully"
    )
  );
});