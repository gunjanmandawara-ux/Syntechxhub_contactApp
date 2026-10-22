import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri || !Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(
    !mongoUri
      ? "MONGODB_URI is missing. Add it to BACKEND/.env."
      : "PORT must be a whole number between 1 and 65535."
  );
  process.exit(1);
}

try {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB.");

  const server = app.listen(port, () => {
    console.log(`Contact API running at http://localhost:${port}`);
  });

  server.on("error", (error) => {
    console.error("Could not start the API server:", error.message);
    process.exitCode = 1;
    void mongoose.disconnect();
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received. Shutting down gracefully.`);

    server.close(async (error) => {
      if (error) {
        console.error("Error while closing the API server:", error.message);
        process.exitCode = 1;
      }
      await mongoose.disconnect();
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
} catch (error) {
  console.error("Could not connect to MongoDB:", error.message);
  process.exit(1);
}
