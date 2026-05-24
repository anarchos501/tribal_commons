import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health";
import projectRoutes from "./routes/projects";
import petitionRoutes from "./routes/petitions";
import tribeRoutes from "./routes/tribes";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/projects", projectRoutes);
app.use("/petitions", petitionRoutes);
app.use("/tribes", tribeRoutes);

app.get("/", (req, res) => {
  res.send("Tribal Commons backend is running.");
});

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
});