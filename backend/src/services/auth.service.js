import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken } from "../utils/jwt.js";

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

export default {
  register,
};