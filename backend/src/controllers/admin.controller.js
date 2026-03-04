import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const adminOnly = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      { role: req.user.role },
      "Welcome Admin"
    )
  );
});