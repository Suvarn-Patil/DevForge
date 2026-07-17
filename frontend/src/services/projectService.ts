import axios from "axios";

const API_URL =
  "https://devforge-api-i5j5.onrender.com/api/projects";

export const getProjects = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createProject = async (
  name: string,
  description: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    {
      name,
      description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getProjectTasks = async (
  projectId: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `https://devforge-api-i5j5.onrender.com/api/tasks/project/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};