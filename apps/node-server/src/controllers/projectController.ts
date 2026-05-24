import { Request, Response } from "express";
import { Project } from "../../../packages/shared-types/project";

let projects: Project[] = [
  {
    id: 1,
    title: "Orbital Refinery Expansion",
    status: "active"
  },
  {
    id: 2,
    title: "Regional Logistics Network",
    status: "proposal"
  }
];

export const getProjects = (req: Request, res: Response) => {
  res.json(projects);
};

export const createProject = (req: Request, res: Response) => {
  if (!req.body.title || req.body.title.trim() === "") {
  return res.status(400).json({
    error: "Project title is required"
  });
}
    const newProject: Project = {
    id: projects.length + 1,
    title: req.body.title,
    status: "proposal"
  };

  projects.push(newProject);

  res.status(201).json(newProject);
};