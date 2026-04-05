import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing env variable: ${key}`);
    process.exit(1);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
};