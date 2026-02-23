import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email } = req.validated;

  return res
    .status(201)
    .json(new ApiResponse(201, { name, email }, "User validated successfully"));
});