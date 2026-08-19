import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import teamRoutes from "./routes/teamRoutes";
import userRoutes from "./routes/userRoutes";
import commentRoutes from "./routes/commentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import activityRoutes from "./routes/activityRoutes";
import aiRoutes from "./routes/aiRoutes";

import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dev-forge-seven-rose.vercel.app",
    ],
    credentials: true,
  })
);

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json({ limit: "1mb" }));

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", activityRoutes);
app.use("/api/ai", aiRoutes);

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "DevForge API Running",
  });
});

// ===============================
// ERROR HANDLER
// ===============================

app.use(errorMiddleware);

export default app;
