import type { Project } from "../../../../../packages/shared-types/project";

let projects: Project[] = [
  {
    id: 1,
    tribeId: 1,
    title: "Orbital Refinery Expansion",
    status: "active"
  },
  {
    id: 2,
    tribeId: 1,
    title: "Regional Logistics Network",
    status: "proposal"
  }
];

export const getProjectsData = (): Project[] => {
  return projects;
};

export const createProjectData = (
  tribeId: number,
  title: string
): Project => {
  const newProject: Project = {
    id: projects.length + 1,
    tribeId,
    title,
    status: "proposal"
  };

  projects.push(newProject);

  return newProject;
};