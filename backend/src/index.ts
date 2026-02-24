// backend/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import v1Routes from "./routes/v1";



// import prisma from "./lib/prisma";
console.log("INDEX TS SERVER STARTED");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  
  res.json({ success: true, message: "Backend is running" });
});
app.use("/api/v1", v1Routes);



app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
