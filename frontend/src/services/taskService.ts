import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const createTask = async (
  title: string,
  description: string,
  project: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    {
      title,
      description,
      priority: "medium",
      project,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const updateTaskStatus = async (
  taskId: string,
  status: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `http://localhost:5000/api/tasks/${taskId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};