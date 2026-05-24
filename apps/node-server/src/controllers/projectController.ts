import { Request, Response } from "express";

import {
  getProjectsData,
  createProjectData
} from "../domains/projects/projectService";

export const getProjects = async (
  req: Request,
  res: Response
) => {
  const projects = await getProjectsData();

  res.json(projects);
};

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !req.body.title ||
      req.body.title.trim() === "" ||
      !req.body.tribeId
    ) {
      return res.status(400).json({
        error: "tribeId and project title are required"
      });
    }

    const newProject = await createProjectData(
      req.body.tribeId,
      req.body.title
    );

    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({
      error: "Unable to create project. Make sure tribeId refers to an existing tribe."
    });
  }
};