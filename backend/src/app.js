import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.join(__dirname, "../../frontend/dist");

const app = express();

/* =========================
   SECURITY MIDDLEWARE
========================= */

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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
   LOGGING
========================= */

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* =========================
   BODY PARSER
========================= */

app.use(express.json());

/* =========================
   API ROUTES
========================= */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "API is healthy 🚀" });
});

/* =========================
   SERVE FRONTEND (production)
   Must come after API routes so /api/* never falls through here.
   The regex skips anything starting with /api/ and hands it to
   React Router so direct URL loads like /login work correctly.
========================= */

app.use(express.static(frontendDist));

app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

/* =========================
   API 404 + GLOBAL ERROR HANDLER
========================= */

app.use(notFoundHandler);
app.use(errorMiddleware);

export default app;
