import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/auth.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.register(req.validated);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
        token: result.token,
      },
      "User registered successfully"
    )
  );
});