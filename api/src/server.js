import "dotenv/config";
import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import ragRoutes from "./routes/rag.routes.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl || "*"
  })
);

app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "RAG API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend server is healthy"
  });
});

app.use("/api", ragRoutes);

const PORT = Number(env.port) || 5051;

const server = app.listen(PORT);

server.on("listening", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other process or change PORT in .env`);
  } else {
    console.error("Server failed to start:", err.message);
  }
  process.exit(1);
});

const shutdown = () => {
  if (!server.listening) {
    process.exit(0);
    return;
  }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 3000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);