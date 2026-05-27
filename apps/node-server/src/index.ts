import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health";
import projectRoutes from "./routes/projectRoutes";
import tribeRoutes from "./routes/tribeRoutes";
import petitionRoutes from "./routes/petitions";
import commonsRoutes from "./routes/commons";
import allocationRoutes from "./routes/allocations";
import membershipRoutes from "./routes/memberships";
import contributionRoutes from "./routes/contributions";
import supportRoutes from "./routes/support";
import dashboardRoutes from "./routes/dashboard";
import notificationRoutes from "./routes/notifications";
import activityFeedRoutes from "./routes/activityFeed";
import coordinationHubRoutes from "./routes/coordinationHub";
import standingsRoutes from "./routes/standings";
import policyRoutes from "./routes/policies";
import federationRoutes from "./routes/federation";
import accountRoutes from "./routes/accounts";
import { startDraftPetitionPublisher } from "./jobs/publishDraftPetitions";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/projects", projectRoutes);
app.use("/tribes", tribeRoutes);
app.use("/petitions", petitionRoutes);
app.use("/commons", commonsRoutes);
app.use("/allocations", allocationRoutes);
app.use("/memberships", membershipRoutes);
app.use("/contributions", contributionRoutes);
app.use("/support", supportRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/notifications", notificationRoutes);
app.use("/activity-feed", activityFeedRoutes);
app.use("/coordination-hub", coordinationHubRoutes);
app.use("/standings", standingsRoutes);
app.use("/policies", policyRoutes);
app.use("/federation", federationRoutes);
app.use("/accounts", accountRoutes);

app.get("/", (req, res) => {
  res.send("Tribal Commons backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startDraftPetitionPublisher();
