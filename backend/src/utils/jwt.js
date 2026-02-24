import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
};