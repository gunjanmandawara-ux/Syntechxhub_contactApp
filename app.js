import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();
const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: frontendOrigins }));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  return res
    .status(databaseReady ? 200 : 503)
    .json({ status: databaseReady ? "ok" : "unavailable" });
});

app.use("/api/contacts", contactRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, _req, res, _next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }

  if (error.type === "charset.unsupported" || error.type === "encoding.unsupported") {
    return res.status(415).json({ message: "Unsupported request encoding." });
  }

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(" ");

    return res.status(400).json({ message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid contact data." });
  }

  if (error.name === "MongoServerSelectionError" || error.name === "MongoNetworkError") {
    console.error("MongoDB request failed:", error.message);
    return res.status(503).json({ message: "Database is temporarily unavailable." });
  }

  console.error(error);
  return res.status(500).json({ message: "Something went wrong on the server." });
});

export default app;
