import Project from "../models/Project";

export const createProject = async (
  name: string,
  description: string,
  owner: string
) => {
  const project = await Project.create({
    name,
    description,
    owner,
  });

  return project;
};

export const getProjectsByOwner = async (owner: string) => {
  const projects = await Project.find({ owner }).sort({
    createdAt: -1,
  });

  return projects;
};

export const getProjectById = async (
  projectId: string,
  owner: string
) => {
  const project = await Project.findOne({
    _id: projectId,
    owner,
  });

  return project;
};

export const updateProject = async (
  projectId: string,
  owner: string,
  data: {
    name?: string;
    description?: string;
  }
) => {
  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
      owner,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  return project;
};

export const deleteProject = async (
  projectId: string,
  owner: string
) => {
  const project = await Project.findOneAndDelete({
    _id: projectId,
    owner,
  });

  return project;
};