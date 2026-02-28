import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import jobRoutes from "./routes/job.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* Security */
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(apiLimiter);

/* Logging */
app.use(morgan("dev"));

/* Body Parser */
app.use(express.json());

/* Routes */
app.use("/api/v1", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

/* Error Handling */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;