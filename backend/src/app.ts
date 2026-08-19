import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import teamRoutes from "./routes/teamRoutes";
import userRoutes from "./routes/userRoutes";
import commentRoutes from "./routes/commentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import activityRoutes from "./routes/activityRoutes";

import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

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

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (_req, res) => {
  res.json({
    message: "DevForge API Running",
  });
});

// ===============================
// ERROR HANDLER
// ===============================

app.use(errorMiddleware);

export default app;
