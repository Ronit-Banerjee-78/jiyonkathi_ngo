import { getAllProjects, addProject } from '../models/projectModel.js';

export const fetchProjectsList = async () => {
  // Business logic formatting can be applied here before returning to controller
  const projects = await getAllProjects();
  return projects;
};

export const createNewProject = async (data) => {
  if (!data.title || !data.targetAmount) {
    throw new Error("Missing required fields: title and targetAmount");
  }
  const newProject = await addProject(data.title, data.targetAmount);
  return newProject;
};
