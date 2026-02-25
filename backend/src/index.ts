// backend/src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";

import ideasRoutes from "./routes/ideas.routes";
import experimentsRoutes from "./routes/experiments.routes";
import outcomesRoutes from "./routes/outcomes.routes";
import reflectionsRoutes from "./routes/reflections.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

// Enables CORS for the frontend running on localhost:3000
app.use(cors({ origin: "http://localhost:3000" }));

// Parses incoming JSON request bodies
app.use(express.json());

// Health check endpoint used to verify backend availability
app.get("/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Backend is running" });
});

// Authentication routes (register, login, token refresh, logout)
app.use("/auth", authRoutes);

// Idea-related routes (create, update, publish, comment, etc.)
app.use("/ideas", ideasRoutes);

// Experiment lifecycle routes
app.use("/experiments", experimentsRoutes);

// Outcome tracking routes linked to experiments
app.use("/outcomes", outcomesRoutes);

// Reflection routes for post-outcome learning
app.use("/reflections", reflectionsRoutes);

// Global error handler to catch unhandled server errors
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;