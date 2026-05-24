import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health";
import projectRoutes from "./routes/projects";
import petitionRoutes from "./routes/petitions";
import tribeRoutes from "./routes/tribes";
import commonsRoutes from "./routes/commons";
import membershipRoutes from "./routes/memberships";
import donationRoutes from "./routes/donations";
import allocationRoutes from "./routes/allocations";
import aidRoutes from "./routes/aid";
import dashboardRoutes from "./routes/dashboard";
import notificationRoutes from "./routes/notifications";
import activityFeedRoutes from "./routes/activityFeed";
import tribesPageRoutes from "./routes/tribesPage";
import coordinationHubRoutes from "./routes/coordinationHub";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/projects", projectRoutes);
app.use("/petitions", petitionRoutes);
app.use("/tribes", tribeRoutes);
app.use("/commons", commonsRoutes);
app.use("/memberships", membershipRoutes);
app.use("/donations", donationRoutes);
app.use("/allocations", allocationRoutes);
app.use("/aid", aidRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/notifications", notificationRoutes);
app.use("/activity-feed", activityFeedRoutes);
app.use("/tribes-page", tribesPageRoutes);
app.use("/coordination-hub", coordinationHubRoutes);

app.get("/", (req, res) => {
  res.send("Tribal Commons backend is running.");
});

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
});