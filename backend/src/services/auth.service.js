import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken } from "../utils/jwt.js";

/* =========================
   REGISTER
========================= */

const register = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

  const token = generateAccessToken(user);

  return { user, token };
};

/* =========================
   LOGIN
========================= */

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateAccessToken(user);

  return { user, token };
};

export default {
  register,
  login,
};