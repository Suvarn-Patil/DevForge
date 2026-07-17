import axios from "axios";

const API_URL =
  "https://devforge-api-i5j5.onrender.com/api/auth";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await axios.post(
    `${API_URL}/register`,
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await axios.post(
    `${API_URL}/login`,
    {
      email,
      password,
    }
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};