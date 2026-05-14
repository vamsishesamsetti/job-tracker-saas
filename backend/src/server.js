import app from "./app.js";
import { prisma } from "./config/prisma.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(env.port, () => {
      console.log(
        `🚀 Server running in ${env.nodeEnv} mode on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
