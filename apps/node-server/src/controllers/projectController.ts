import { Request, Response } from "express";

import {
  getProjectsData,
  createProjectData,
  updateProjectStatusData
} from "../domains/projects/projectService";

export const getProjects = async (
  req: Request,
  res: Response
) => {

  const projects =
    await getProjectsData();

  res.json(projects);
};

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {

    if (
      !req.body.tribeId ||
      !req.body.title
    ) {
      return res.status(400).json({
        error:
          "tribeId and title are required"
      });
    }

    const project =
      await createProjectData(
        req.body.tribeId,
        req.body.title
      );

    res.status(201).json(project);

  } catch (error) {

    res.status(400).json({
      error:
        "Unable to create project. Make sure tribeId refers to an existing tribe."
    });
  }
};

export const updateProjectStatus = async (
  req: Request,
  res: Response
) => {
  try {

    const projectId =
      Number(req.params.projectId);

    const { status } = req.body;

    const validStatuses = [
  "proposal",
  "staging",
  "sustained",
  "completed",
  "failed",
  "archived"
];

    if (
      !status ||
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        error:
          "Invalid project status"
      });
    }

    const updatedProject =
      await updateProjectStatusData(
        projectId,
        status
      );

    res.json(updatedProject);

  } catch (error) {

    res.status(400).json({
      error:
        "Unable to update project status"
    });
  }
};