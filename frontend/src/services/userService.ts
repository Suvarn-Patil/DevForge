import api from "../api/axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SearchUser = User;

/* ================================
   GET CURRENT USER
================================ */

export const getCurrentUser =
  async (): Promise<User> => {
    const response =
      await api.get("/users/me");

    return response.data;
  };

/* ================================
   UPDATE CURRENT USER
================================ */

export const updateCurrentUser =
  async (
    name: string,
    email: string
  ): Promise<User> => {
    const response =
      await api.patch(
        "/users/me",
        {
          name,
          email,
        }
      );

    return response.data;
  };

/* ================================
   CHANGE PASSWORD
================================ */

export const changePassword =
  async (
    currentPassword: string,
    newPassword: string
  ) => {
    const response =
      await api.patch(
        "/users/me/password",
        {
          currentPassword,
          newPassword,
        }
      );

    return response.data;
  };

/* ================================
   SEARCH USERS
================================ */

export const searchUsers =
  async (
    search: string
  ): Promise<User[]> => {
    const response =
      await api.get(
        "/users/search",
        {
          params: {
            search,
          },
        }
      );

    return response.data;
  };
