import { Request, Response } from "express";
import {
  getProjectsData,
  createProjectData
} from "../domains/projects/projectService";

export const getProjects = (
  req: Request,
  res: Response
) => {
  res.json(getProjectsData());
};

export const createProject = (
  req: Request,
  res: Response
) => {
  if (
    !req.body.title ||
    req.body.title.trim() === "" ||
    !req.body.tribeId
  ) {
    return res.status(400).json({
      error: "tribeId and project title are required"
    });
  }

  const newProject = createProjectData(
    req.body.tribeId,
    req.body.title
  );

  res.status(201).json(newProject);
};