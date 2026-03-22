import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/auth.service.js";
import bcrypt from "bcryptjs";

/* =========================
   REGISTER
========================= */

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

/* =========================
   LOGIN
========================= */

export const loginUser = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
        token: result.token,
      },
      "Login successful"
    )
  );
});

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { name },
  });

  res.status(200).json({
    success: true,
    data: updatedUser,
    message: "Profile updated",
  });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // 1. Get user from DB
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  // 2. Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  // 3. Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4. Update
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});