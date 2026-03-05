import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

/* =========================
   SECURITY MIDDLEWARE
========================= */

app.use(helmet());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, please try again later.",
});

app.use(limiter);

/* =========================
   BODY PARSER
========================= */

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy 🚀",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use(errorMiddleware);

export default app;