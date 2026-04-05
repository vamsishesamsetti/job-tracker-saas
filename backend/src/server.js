import app from "./app.js";
import { prisma } from "./config/prisma.js";
import { env } from "./config/env.js";

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 Server running in ${env.nodeEnv} mode on port ${PORT}`
      );
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();