import axios from "axios";

const API_URL =
  "https://devforge-api-i5j5.onrender.com/api/tasks";

export const getTasks = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

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
    `${API_URL}/${taskId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};