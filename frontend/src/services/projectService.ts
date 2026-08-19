import api from "../api/axios";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects");

  return response.data;
};

export const createProject = async (
  name: string,
  description: string
) => {
  const response = await api.post("/projects", {
    name,
    description,
  });

  return response.data;
};

export const getProject = async (
  projectId: string
): Promise<Project> => {
  const response = await api.get(
    `/projects/${projectId}`
  );

  return response.data;
};

export const updateProject = async (
  projectId: string,
  data: {
    name: string;
    description: string;
  }
) => {
  const response = await api.put(
    `/projects/${projectId}`,
    data
  );

  return response.data;
};

export const deleteProject = async (
  projectId: string
) => {
  const response = await api.delete(
    `/projects/${projectId}`
  );

  return response.data;
};

export const getProjectTasks = async (
  projectId: string
) => {
  const response = await api.get("/tasks", {
    params: {
      project: projectId,
    },
  });

  return response.data.tasks ?? response.data;
};
